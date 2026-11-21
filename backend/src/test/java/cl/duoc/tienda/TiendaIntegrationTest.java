package cl.duoc.tienda;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:tienda_pruebas",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "TIENDA_ADMIN_PASSWORD=test-admin-local",
    "TIENDA_CLIENTE_PASSWORD=test-cliente-local"
})
@AutoConfigureMockMvc
class TiendaIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    private static final String PRODUCTO = """
        {"nombre":"Prueba CRUD","categoria":"Pruebas","descripcion":"Producto de integración","precio_nuevo":2500,"stock":3}
        """;

    @Test
    void swaggerCatalogoYCrudProtegido() throws Exception {
        mvc.perform(get("/v3/api-docs")).andExpect(status().isOk())
            .andExpect(jsonPath("$.paths['/api/productos'].post.security[0].jwt").isArray());
        mvc.perform(get("/api/productos")).andExpect(status().isOk()).andExpect(jsonPath("$[0].nombre").exists());
        mvc.perform(post("/api/productos").contentType("application/json").content(PRODUCTO))
            .andExpect(status().isUnauthorized());
        mvc.perform(post("/api/productos").header("Authorization", bearer(login("cliente")))
            .contentType("application/json").content(PRODUCTO)).andExpect(status().isForbidden());

        String admin = bearer(login("admin"));
        mvc.perform(post("/api/productos").header("Authorization", admin)
            .contentType("application/json").content(PRODUCTO.replace("2500", "-1")))
            .andExpect(status().isBadRequest());
        var creado = mvc.perform(post("/api/productos").header("Authorization", admin)
            .contentType("application/json").content(PRODUCTO)).andExpect(status().isCreated()).andReturn();
        long id = json.readTree(creado.getResponse().getContentAsString()).get("id").asLong();
        String ruta = "/api/productos/" + id;
        mvc.perform(get(ruta)).andExpect(status().isOk()).andExpect(jsonPath("$.stock").value(3));
        mvc.perform(put(ruta).header("Authorization", admin).contentType("application/json")
            .content(PRODUCTO.replace("\"stock\":3", "\"stock\":4")))
            .andExpect(status().isOk()).andExpect(jsonPath("$.stock").value(4));
        mvc.perform(delete(ruta).header("Authorization", admin)).andExpect(status().isNoContent());
        mvc.perform(get(ruta)).andExpect(status().isNotFound());
    }

    @Test
    void sesionRenuevaJwtYDejaDeRenovarAlSalir() throws Exception {
        var sesion = (MockHttpSession) login("cliente").getRequest().getSession(false);
        mvc.perform(post("/api/auth/renovar").session(sesion)).andExpect(status().isForbidden());
        mvc.perform(post("/api/auth/renovar").session(sesion).header("X-Tienda-Cliente", "tienda"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.rol").value("CLIENTE"))
            .andExpect(jsonPath("$.token").isString());
        mvc.perform(post("/api/auth/logout").session(sesion).header("X-Tienda-Cliente", "tienda"))
            .andExpect(status().isNoContent());
        mvc.perform(post("/api/auth/renovar").header("X-Tienda-Cliente", "tienda"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void compraUsaPrecioDeLaBaseYDescuentaStock() throws Exception {
        var catalogo = mvc.perform(get("/api/productos/1")).andExpect(status().isOk()).andReturn();
        var producto = json.readTree(catalogo.getResponse().getContentAsString());
        int stock = producto.get("stock").asInt();
        int precio = producto.get("precio_nuevo").asInt();
        String cliente = bearer(login("cliente"));
        String pedido = "{\"items\":[{\"id\":1,\"cantidad\":2}]}";
        mvc.perform(post("/api/compras").header("Authorization", cliente).contentType("application/json").content(pedido))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.total").value(precio * 2));
        mvc.perform(get("/api/productos/1")).andExpect(jsonPath("$.stock").value(stock - 2));

        String sinStock = "{\"items\":[{\"id\":1,\"cantidad\":999}]}";
        mvc.perform(post("/api/compras").header("Authorization", cliente).contentType("application/json").content(sinStock))
            .andExpect(status().isConflict());
        mvc.perform(get("/api/productos/1")).andExpect(jsonPath("$.stock").value(stock - 2));
    }

    private MvcResult login(String usuario) throws Exception {
        return mvc.perform(post("/api/auth/login").header("X-Tienda-Cliente", "tienda")
            .contentType("application/json")
            .content(json.writeValueAsString(java.util.Map.of("usuario", usuario, "password", "test-" + usuario + "-local"))))
            .andExpect(status().isOk()).andReturn();
    }

    private String bearer(MvcResult login) throws Exception {
        return "Bearer " + json.readTree(login.getResponse().getContentAsString()).get("token").asText();
    }
}
