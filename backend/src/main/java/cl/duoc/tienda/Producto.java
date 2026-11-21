package cl.duoc.tienda;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Producto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public String nombre;
    public String categoria;
    @Column(length = 1000)
    public String descripcion;
    @Column(length = 2000)
    public String historia;
    @Column(length = 2048)
    public String imagen;
    @JsonProperty("precio_nuevo")
    public int precio;
    public int stock;

    protected Producto() {}

    Producto(Datos datos) {
        actualizar(datos);
    }

    void actualizar(Datos datos) {
        nombre = datos.nombre();
        categoria = datos.categoria();
        descripcion = datos.descripcion();
        if (datos.historia() != null) {
            historia = datos.historia();
        }
        imagen = datos.imagen();
        precio = datos.precio();
        stock = datos.stock();
    }

    public record Datos(
        @NotBlank @Size(max = 150) String nombre,
        @NotBlank @Size(max = 100) String categoria,
        @NotBlank @Size(max = 1000) String descripcion,
        @Size(max = 2000) String historia,
        @Size(max = 2048) String imagen,
        @JsonProperty("precio_nuevo") @NotNull @Positive Integer precio,
        @NotNull @PositiveOrZero Integer stock
    ) {}
}
