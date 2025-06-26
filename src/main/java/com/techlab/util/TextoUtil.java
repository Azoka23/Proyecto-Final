package com.techlab.util;


public class TextoUtil {

    /**
     * Compara dos strings ignorando mayúsculas, minúsculas y espacios extras.
     * Retorna true si son iguales lógicamente.
     */
    public static boolean iguales(String a, String b) {
        if (a == null || b == null) return false;
        return a.trim().equalsIgnoreCase(b.trim());
    }
}
