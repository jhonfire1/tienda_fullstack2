package cl.duoc.tienda;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
class Errores {
    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<ProblemDetail> estado(ResponseStatusException error) {
        return ResponseEntity.status(error.getStatusCode()).body(error.getBody());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ProblemDetail> validacion(MethodArgumentNotValidException error) {
        var campo = error.getBindingResult().getFieldError();
        String detalle = campo == null ? "Revisa los datos enviados" : campo.getField() + ": " + campo.getDefaultMessage();
        return ResponseEntity.badRequest().body(ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, detalle));
    }
}
