package cl.duoc.tienda;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
class ProductoController {
    private final ProductoRepository repositorio;

    ProductoController(ProductoRepository repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping
    List<Producto> listar() {
        return repositorio.findAll(Sort.by("id"));
    }

    @GetMapping("/{id}")
    Producto obtener(@PathVariable long id) {
        return repositorio.findById(id).orElseThrow(ProductoController::sinProducto);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = "jwt")
    Producto crear(@Valid @RequestBody Producto.Datos datos) {
        return repositorio.save(new Producto(datos));
    }

    @PutMapping("/{id}")
    @Transactional
    @SecurityRequirement(name = "jwt")
    Producto actualizar(@PathVariable long id, @Valid @RequestBody Producto.Datos datos) {
        var producto = repositorio.bloquear(id).orElseThrow(ProductoController::sinProducto);
        producto.actualizar(datos);
        return producto;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    @SecurityRequirement(name = "jwt")
    void eliminar(@PathVariable long id) {
        repositorio.delete(repositorio.bloquear(id).orElseThrow(ProductoController::sinProducto));
    }

    static ResponseStatusException sinProducto() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
    }
}
