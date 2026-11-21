package cl.duoc.tienda;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.HashMap;
import java.util.List;

@SpringBootApplication
public class TiendaApplication {
    public static void main(String[] args) {
        SpringApplication.run(TiendaApplication.class, args);
    }

    record Catalogo(List<Producto.Datos> productos) {}

    @Bean
    ApplicationRunner datosIniciales(ProductoRepository productos, UsuarioRepository usuarios,
                                     ObjectMapper mapper, PasswordEncoder encoder,
                                     TransactionTemplate transaction,
                                     @Value("${TIENDA_ADMIN_PASSWORD:}") String admin,
                                     @Value("${TIENDA_CLIENTE_PASSWORD:}") String cliente) {
        return args -> {
            try (var archivo = new ClassPathResource("catalogo.json").getInputStream()) {
                var catalogo = mapper.readerFor(new TypeReference<Catalogo>() {})
                    .without(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                    .<Catalogo>readValue(archivo);
                transaction.executeWithoutResult(status -> {
                    if (productos.count() == 0 && usuarios.count() == 0) {
                        productos.saveAll(catalogo.productos().stream().map(Producto::new).toList());
                    } else {
                        var historias = new HashMap<String, String>();
                        for (var juego : catalogo.productos()) {
                            historias.put(juego.nombre(), juego.historia());
                        }
                        for (var producto : productos.findByHistoriaIsNull()) {
                            producto.historia = historias.get(producto.nombre);
                        }
                    }
                    guardarCuenta(usuarios, encoder, "admin", admin, "ADMIN");
                    guardarCuenta(usuarios, encoder, "cliente", cliente, "CLIENTE");
                });
            }
        };
    }

    private static void guardarCuenta(UsuarioRepository usuarios, PasswordEncoder encoder,
                                      String nombre, String password, String rol) {
        if (!password.isBlank() && usuarios.findById(nombre).isEmpty()) {
            usuarios.save(new Usuario(nombre, encoder.encode(password), rol));
        }
    }
}
