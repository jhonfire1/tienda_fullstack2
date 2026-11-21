package cl.duoc.tienda;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
class AuthController {
    private static final String USUARIO = "usuario";
    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;
    private final JwtEncoder tokens;
    private final String hashDeComparacion;

    AuthController(UsuarioRepository usuarios, PasswordEncoder encoder, JwtEncoder tokens) {
        this.usuarios = usuarios;
        this.encoder = encoder;
        this.tokens = tokens;
        this.hashDeComparacion = encoder.encode(java.util.UUID.randomUUID().toString());
    }

    record Credenciales(@NotBlank @Size(max = 100) String usuario,
                        @NotBlank @Size(max = 72) String password) {}
    record Sesion(String usuario, String rol, String token) {}

    @PostMapping("/login")
    @Parameter(name = "X-Tienda-Cliente", in = ParameterIn.HEADER, required = true, schema = @Schema(defaultValue = "tienda"))
    ResponseEntity<Sesion> login(@Valid @RequestBody Credenciales datos, HttpServletRequest request) {
        verificarEncabezado(request);
        var usuario = usuarios.findById(datos.usuario()).orElse(null);
        String hash = usuario == null ? hashDeComparacion : usuario.hash;
        if (datos.password().getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72
                || !encoder.matches(datos.password(), hash) || usuario == null) {
            throw sinSesion();
        }

        var previa = request.getSession(false);
        if (previa != null) previa.invalidate();
        request.getSession(true).setAttribute(USUARIO, usuario.nombre);
        return emitir(usuario);
    }

    @PostMapping("/renovar")
    @Parameter(name = "X-Tienda-Cliente", in = ParameterIn.HEADER, required = true, schema = @Schema(defaultValue = "tienda"))
    ResponseEntity<Sesion> renovar(HttpServletRequest request) {
        verificarEncabezado(request);
        var sesion = request.getSession(false);
        if (sesion == null || !(sesion.getAttribute(USUARIO) instanceof String nombre)) {
            throw sinSesion();
        }
        return emitir(usuarios.findById(nombre).orElseThrow(AuthController::sinSesion));
    }

    @PostMapping("/logout")
    @Parameter(name = "X-Tienda-Cliente", in = ParameterIn.HEADER, required = true, schema = @Schema(defaultValue = "tienda"))
    ResponseEntity<Void> logout(HttpServletRequest request) {
        verificarEncabezado(request);
        var sesion = request.getSession(false);
        if (sesion != null) sesion.invalidate();
        return ResponseEntity.noContent().cacheControl(CacheControl.noStore()).build();
    }

    private ResponseEntity<Sesion> emitir(Usuario usuario) {
        var ahora = Instant.now();
        var datos = JwtClaimsSet.builder().issuer(Seguridad.EMISOR).issuedAt(ahora)
            .expiresAt(ahora.plusSeconds(300)).subject(usuario.nombre)
            .claim("roles", List.of(usuario.rol)).build();
        var cabecera = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = tokens.encode(JwtEncoderParameters.from(cabecera, datos)).getTokenValue();
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
            .body(new Sesion(usuario.nombre, usuario.rol, token));
    }

    private static void verificarEncabezado(HttpServletRequest request) {
        if (!"tienda".equals(request.getHeader("X-Tienda-Cliente"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solicitud de sesión inválida");
        }
    }

    private static ResponseStatusException sinSesion() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas o sesión vencida");
    }
}
