---
title: "Oracle: validar un INSERT sin ejecutarlo con DBMS_SQL.PARSE"
type: note
category: Oracle
categoryKey: [oracle, bases-de-datos]
tags:
  - Oracle
  - PL/SQL
  - DBMS_SQL
status: published
created: 2026-09-26
updated: 2026-09-26
excerpt: "Comprueba la sintaxis y los objetos de un DML contra la base real sin insertar nada ni consumir secuencias."
sources:
  - engram#820
confidentiality: SAFE
---

## Problema

Tienes un `INSERT` complejo (un `INSERT ... SELECT` con CTE, por ejemplo) y quieres saber si compila contra la base real: que las tablas y columnas existan y que la sintaxis sea válida. Pero no quieres insertar datos ni avanzar una secuencia.

## Solución

```sql
DECLARE
  c INTEGER := DBMS_SQL.OPEN_CURSOR;
BEGIN
  DBMS_SQL.PARSE(c, q'[
    INSERT INTO clientes_lead (id, cliente, telefono)
    SELECT seq_lead.NEXTVAL, c.id, c.telefono
      FROM clientes c
     WHERE c.id = :cliente
  ]', DBMS_SQL.NATIVE);
  DBMS_SQL.CLOSE_CURSOR(c);
  DBMS_OUTPUT.PUT_LINE('OK: parsea');
EXCEPTION
  WHEN OTHERS THEN
    IF DBMS_SQL.IS_OPEN(c) THEN DBMS_SQL.CLOSE_CURSOR(c); END IF;
    RAISE;
END;
/
```

`PARSE` valida la sentencia, pero sin `DBMS_SQL.EXECUTE` no se ejecuta: no se inserta nada y no se consume la secuencia.

## Cuándo usarlo

- Revisar un script antes de pasarlo a un ambiente donde no puedes hacer pruebas.
- Validar plantillas de SQL que se generan desde código.

> **Cuidado con el DDL:** en un `CREATE`, `ALTER` o `DROP`, `DBMS_SQL.PARSE` **sí lo ejecuta** en el momento. Este truco solo es seguro con DML (`INSERT`, `UPDATE`, `DELETE`, `MERGE`) y `SELECT`.
