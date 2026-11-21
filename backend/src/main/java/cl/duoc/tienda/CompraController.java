package cl.duoc.tienda;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@RestController
@RequestMapping("/api/compras")
@SecurityRequirement(name = "jwt")
class CompraController {
    private final ProductoRepository productos;
    private final CompraRepository compras;

    CompraController(ProductoRepository productos, CompraRepository compras) {
        this.productos = productos;
        this.compras = compras;
    }

    record Item(@NotNull @Positive Long id, @NotNull @Min(1) @Max(999) Integer cantidad) {}
    record Solicitud(@NotEmpty @Size(max = 100) List<@NotNull @Valid Item> items) {}
    record Recibo(Long id, long total) {}

    @PostMapping
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    Recibo comprar(@Valid @RequestBody Solicitud solicitud, Authentication usuario) {
        Map<Long, Integer> cantidades = new TreeMap<>();
        for (var item : solicitud.items()) {
            cantidades.merge(item.id(), item.cantidad(), Integer::sum);
        }

        var compra = new Compra();
        compra.usuario = usuario.getName();
        compra.fecha = Instant.now();
        for (var item : cantidades.entrySet()) {
            var producto = productos.bloquear(item.getKey()).orElseThrow(ProductoController::sinProducto);
            if (producto.stock < item.getValue()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock insuficiente para " + producto.nombre);
            }
            producto.stock -= item.getValue();
            compra.total += (long) producto.precio * item.getValue();
            compra.lineas.add(new LineaCompra(producto.id, producto.nombre, producto.precio, item.getValue()));
        }
        compras.save(compra);
        return new Recibo(compra.id, compra.total);
    }
}

@Entity
class Compra {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String usuario;
    Instant fecha;
    long total;

    @ElementCollection
    List<LineaCompra> lineas = new java.util.ArrayList<>();
}

@Embeddable
record LineaCompra(Long productoId, String nombre, int precio, int cantidad) {}

interface CompraRepository extends JpaRepository<Compra, Long> {}
