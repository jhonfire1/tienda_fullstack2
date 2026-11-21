package cl.duoc.tienda;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;

@Entity
class Usuario {
    @Id
    String nombre;
    String hash;
    String rol;

    protected Usuario() {}

    Usuario(String nombre, String hash, String rol) {
        this.nombre = nombre;
        this.hash = hash;
        this.rol = rol;
    }
}

interface UsuarioRepository extends JpaRepository<Usuario, String> {}
