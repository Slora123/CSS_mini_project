package java_security;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;

public class MacSecurityModule {

    public static void main(String[] args) {
        if (args.length < 1) {
            printError("Invalid arguments. Usage: java MacSecurityModule <generate|verify|key-gen> [params...]");
            return;
        }

        String mode = args[0].toLowerCase();
        long startTime = System.nanoTime();

        try {
            switch (mode) {
                case "generate":
                    if (args.length < 4) {
                        printError("Usage: generate <algorithm> <secretKey> <message>");
                        return;
                    }
                    handleGenerate(args[1], args[2], args[3], startTime);
                    break;

                case "verify":
                    if (args.length < 5) {
                        printError("Usage: verify <algorithm> <secretKey> <message> <expectedMac>");
                        return;
                    }
                    handleVerify(args[1], args[2], args[3], args[4], startTime);
                    break;

                default:
                    printError("Unknown mode: " + mode);
            }
        } catch (Exception e) {
            printError("Security Error: " + e.getMessage());
        }
    }

    private static void handleGenerate(String algorithm, String secretKey, String message, long startTime) throws Exception {
        String algoName = normalizeAlgorithm(algorithm);
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        byte[] messageBytes = message.getBytes(StandardCharsets.UTF_8);

        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, algoName);
        Mac macInstance = Mac.getInstance(algoName);
        macInstance.init(keySpec);

        byte[] macBytes = macInstance.doFinal(messageBytes);
        String macHex = bytesToHex(macBytes);
        long durationNs = System.nanoTime() - startTime;
        double durationMs = durationNs / 1_000_000.0;

        // Calculate HMAC internal pad vectors for visualization
        int blockSize = algoName.endsWith("512") ? 128 : 64;
        byte[] kPrime = padOrHashKey(keyBytes, algoName, blockSize);
        byte[] ipad = new byte[blockSize];
        byte[] opad = new byte[blockSize];
        for (int i = 0; i < blockSize; i++) {
            ipad[i] = (byte) (kPrime[i] ^ 0x36);
            opad[i] = (byte) (kPrime[i] ^ 0x5c);
        }

        System.out.println("{");
        System.out.println("  \"status\": \"success\",");
        System.out.println("  \"mode\": \"generate\",");
        System.out.println("  \"algorithm\": \"" + escapeJson(algoName) + "\",");
        System.out.println("  \"macHex\": \"" + macHex + "\",");
        System.out.println("  \"macLengthBits\": " + (macBytes.length * 8) + ",");
        System.out.println("  \"executionTimeMs\": " + String.format("%.3f", durationMs) + ",");
        System.out.println("  \"breakdown\": {");
        System.out.println("    \"keyLengthBytes\": " + keyBytes.length + ",");
        System.out.println("    \"paddedKeyHex\": \"" + bytesToHex(kPrime) + "\",");
        System.out.println("    \"ipadHex\": \"" + bytesToHex(ipad) + "\",");
        System.out.println("    \"opadHex\": \"" + bytesToHex(opad) + "\"");
        System.out.println("  }");
        System.out.println("}");
    }

    private static void handleVerify(String algorithm, String secretKey, String message, String expectedMac, long startTime) throws Exception {
        String algoName = normalizeAlgorithm(algorithm);
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        byte[] messageBytes = message.getBytes(StandardCharsets.UTF_8);

        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, algoName);
        Mac macInstance = Mac.getInstance(algoName);
        macInstance.init(keySpec);

        byte[] computedBytes = macInstance.doFinal(messageBytes);
        String computedHex = bytesToHex(computedBytes);

        byte[] expectedBytes = hexToBytes(expectedMac.trim());
        
        // Use constant-time MessageDigest.isEqual to prevent timing attacks
        boolean isValid = MessageDigest.isEqual(computedBytes, expectedBytes);
        
        long durationNs = System.nanoTime() - startTime;
        double durationMs = durationNs / 1_000_000.0;

        System.out.println("{");
        System.out.println("  \"status\": \"success\",");
        System.out.println("  \"mode\": \"verify\",");
        System.out.println("  \"algorithm\": \"" + escapeJson(algoName) + "\",");
        System.out.println("  \"isValid\": " + isValid + ",");
        System.out.println("  \"computedMacHex\": \"" + computedHex + "\",");
        System.out.println("  \"expectedMacHex\": \"" + escapeJson(expectedMac.trim()) + "\",");
        System.out.println("  \"executionTimeMs\": " + String.format("%.3f", durationMs) + "");
        System.out.println("}");
    }

    private static String normalizeAlgorithm(String algo) {
        String clean = algo.toUpperCase().replaceAll("[^A-Z0-9]", "");
        if (clean.contains("256")) return "HmacSHA256";
        if (clean.contains("512")) return "HmacSHA512";
        if (clean.contains("MD5")) return "HmacMD5";
        if (clean.contains("SHA1") || clean.contains("1")) return "HmacSHA1";
        return "HmacSHA256";
    }

    private static byte[] padOrHashKey(byte[] key, String algo, int blockSize) throws Exception {
        byte[] kPrime = new byte[blockSize];
        if (key.length > blockSize) {
            String hashAlgo = algo.replace("Hmac", "");
            MessageDigest md = MessageDigest.getInstance(hashAlgo.equals("MD5") ? "MD5" : hashAlgo);
            byte[] hashedKey = md.digest(key);
            System.arraycopy(hashedKey, 0, kPrime, 0, hashedKey.length);
        } else {
            System.arraycopy(key, 0, kPrime, 0, key.length);
        }
        return kPrime;
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    private static byte[] hexToBytes(String hex) {
        if (hex == null || hex.isEmpty()) return new byte[0];
        // clean non-hex
        String cleaned = hex.replaceAll("[^0-9a-fA-F]", "");
        if (cleaned.length() % 2 != 0) {
            cleaned = "0" + cleaned;
        }
        int len = cleaned.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(cleaned.charAt(i), 16) << 4)
                                 + Character.digit(cleaned.charAt(i+1), 16));
        }
        return data;
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }

    private static void printError(String message) {
        System.out.println("{");
        System.out.println("  \"status\": \"error\",");
        System.out.println("  \"message\": \"" + escapeJson(message) + "\"");
        System.out.println("}");
    }
}
