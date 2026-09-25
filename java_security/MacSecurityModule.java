package java_security;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class MacSecurityModule {

    public static void main(String[] args) {
        if (args.length < 1) {
            printError("Usage: java MacSecurityModule <generate|verify|key-gen> [params...]");
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
            printError("MAC Security Error: " + e.getMessage());
        }
    }

    private static void handleGenerate(String algorithm, String secretKey, String message, long startTime) throws Exception {
        String algo = normalizeAlgo(algorithm);
        byte[] keyBytes = prepareKeyBytes(secretKey, 16); // 128-bit key
        byte[] messageBytes = message.getBytes(StandardCharsets.UTF_8);

        String macHex = "";
        List<BlockStep> blockSteps = new ArrayList<>();

        if (algo.startsWith("CBC")) {
            // CBC-MAC (AES-128) Block Cipher Chaining MAC
            Cipher cipher = Cipher.getInstance("AES/ECB/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);

            byte[] paddedMsg = padPkcs7(messageBytes, 16);
            byte[] previousTag = new byte[16]; // IV = 0 for standard CBC-MAC

            for (int i = 0; i < paddedMsg.length; i += 16) {
                byte[] block = new byte[16];
                System.arraycopy(paddedMsg, i, block, 0, 16);

                byte[] xorBlock = new byte[16];
                for (int j = 0; j < 16; j++) {
                    xorBlock[j] = (byte) (block[j] ^ previousTag[j]);
                }

                byte[] encryptedBlock = cipher.doFinal(xorBlock);
                blockSteps.add(new BlockStep(i / 16 + 1, bytesToHex(block), bytesToHex(xorBlock), bytesToHex(encryptedBlock)));
                previousTag = encryptedBlock;
            }
            macHex = bytesToHex(previousTag);
        } else if (algo.startsWith("CMAC")) {
            // CMAC (NIST SP 800-38B) using AES-128
            Cipher cipher = Cipher.getInstance("AES/ECB/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);

            // Generate Subkey K1 and K2
            byte[] L = cipher.doFinal(new byte[16]);
            byte[] K1 = generateSubkey(L);
            byte[] K2 = generateSubkey(K1);

            int numBlocks = (int) Math.ceil((double) Math.max(1, messageBytes.length) / 16.0);
            boolean completeBlock = (messageBytes.length > 0 && messageBytes.length % 16 == 0);

            byte[] paddedMsg;
            if (completeBlock) {
                paddedMsg = new byte[numBlocks * 16];
                System.arraycopy(messageBytes, 0, paddedMsg, 0, messageBytes.length);
                // XOR last block with K1
                int lastOffset = (numBlocks - 1) * 16;
                for (int j = 0; j < 16; j++) {
                    paddedMsg[lastOffset + j] ^= K1[j];
                }
            } else {
                paddedMsg = padCmacBit100(messageBytes, numBlocks * 16);
                // XOR last block with K2
                int lastOffset = (numBlocks - 1) * 16;
                for (int j = 0; j < 16; j++) {
                    paddedMsg[lastOffset + j] ^= K2[j];
                }
            }

            byte[] previousTag = new byte[16];
            for (int i = 0; i < paddedMsg.length; i += 16) {
                byte[] block = new byte[16];
                System.arraycopy(paddedMsg, i, block, 0, 16);

                byte[] xorBlock = new byte[16];
                for (int j = 0; j < 16; j++) {
                    xorBlock[j] = (byte) (block[j] ^ previousTag[j]);
                }

                byte[] encryptedBlock = cipher.doFinal(xorBlock);
                blockSteps.add(new BlockStep(i / 16 + 1, bytesToHex(block), bytesToHex(xorBlock), bytesToHex(encryptedBlock)));
                previousTag = encryptedBlock;
            }
            macHex = bytesToHex(previousTag);
        } else {
            // General Keyed MAC (HmacSHA256 based Keyed MAC)
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(keySpec);
            byte[] macBytes = mac.doFinal(messageBytes);
            macHex = bytesToHex(macBytes);
            blockSteps.add(new BlockStep(1, bytesToHex(messageBytes), bytesToHex(keyBytes), macHex));
        }

        long durationNs = System.nanoTime() - startTime;
        double durationMs = durationNs / 1_000_000.0;

        System.out.println("{");
        System.out.println("  \"status\": \"success\",");
        System.out.println("  \"mode\": \"generate\",");
        System.out.println("  \"algorithm\": \"" + escapeJson(algo) + "\",");
        System.out.println("  \"macHex\": \"" + macHex + "\",");
        System.out.println("  \"macLengthBits\": " + (macHex.length() * 4) + ",");
        System.out.println("  \"executionTimeMs\": " + String.format("%.3f", durationMs) + ",");
        System.out.println("  \"blocks\": [");
        for (int b = 0; b < blockSteps.size(); b++) {
            BlockStep bs = blockSteps.get(b);
            System.out.print("    { \"index\": " + bs.index + ", \"plainHex\": \"" + bs.plainHex + "\", \"xorHex\": \"" + bs.xorHex + "\", \"encHex\": \"" + bs.encHex + "\" }");
            if (b < blockSteps.size() - 1) System.out.println(",");
            else System.out.println();
        }
        System.out.println("  ]");
        System.out.println("}");
    }

    private static void handleVerify(String algorithm, String secretKey, String message, String expectedMac, long startTime) throws Exception {
        String algo = normalizeAlgo(algorithm);
        // Re-generate MAC to compare
        long genStart = System.nanoTime();
        byte[] keyBytes = prepareKeyBytes(secretKey, 16);
        byte[] messageBytes = message.getBytes(StandardCharsets.UTF_8);

        String computedHex = "";
        if (algo.startsWith("CBC")) {
            Cipher cipher = Cipher.getInstance("AES/ECB/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] paddedMsg = padPkcs7(messageBytes, 16);
            byte[] previousTag = new byte[16];
            for (int i = 0; i < paddedMsg.length; i += 16) {
                byte[] block = new byte[16];
                System.arraycopy(paddedMsg, i, block, 0, 16);
                byte[] xorBlock = new byte[16];
                for (int j = 0; j < 16; j++) {
                    xorBlock[j] = (byte) (block[j] ^ previousTag[j]);
                }
                previousTag = cipher.doFinal(xorBlock);
            }
            computedHex = bytesToHex(previousTag);
        } else if (algo.startsWith("CMAC")) {
            Cipher cipher = Cipher.getInstance("AES/ECB/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] L = cipher.doFinal(new byte[16]);
            byte[] K1 = generateSubkey(L);
            byte[] K2 = generateSubkey(K1);

            int numBlocks = (int) Math.ceil((double) Math.max(1, messageBytes.length) / 16.0);
            boolean completeBlock = (messageBytes.length > 0 && messageBytes.length % 16 == 0);
            byte[] paddedMsg;
            if (completeBlock) {
                paddedMsg = new byte[numBlocks * 16];
                System.arraycopy(messageBytes, 0, paddedMsg, 0, messageBytes.length);
                int lastOffset = (numBlocks - 1) * 16;
                for (int j = 0; j < 16; j++) paddedMsg[lastOffset + j] ^= K1[j];
            } else {
                paddedMsg = padCmacBit100(messageBytes, numBlocks * 16);
                int lastOffset = (numBlocks - 1) * 16;
                for (int j = 0; j < 16; j++) paddedMsg[lastOffset + j] ^= K2[j];
            }

            byte[] previousTag = new byte[16];
            for (int i = 0; i < paddedMsg.length; i += 16) {
                byte[] block = new byte[16];
                System.arraycopy(paddedMsg, i, block, 0, 16);
                byte[] xorBlock = new byte[16];
                for (int j = 0; j < 16; j++) xorBlock[j] = (byte) (block[j] ^ previousTag[j]);
                previousTag = cipher.doFinal(xorBlock);
            }
            computedHex = bytesToHex(previousTag);
        } else {
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(keySpec);
            computedHex = bytesToHex(mac.doFinal(messageBytes));
        }

        byte[] compBytes = hexToBytes(computedHex);
        byte[] expBytes = hexToBytes(expectedMac.trim());

        // Constant time comparison to prevent timing side-channel attacks
        boolean isValid = MessageDigest.isEqual(compBytes, expBytes);
        long durationNs = System.nanoTime() - startTime;
        double durationMs = durationNs / 1_000_000.0;

        System.out.println("{");
        System.out.println("  \"status\": \"success\",");
        System.out.println("  \"mode\": \"verify\",");
        System.out.println("  \"algorithm\": \"" + escapeJson(algo) + "\",");
        System.out.println("  \"isValid\": " + isValid + ",");
        System.out.println("  \"computedMacHex\": \"" + computedHex + "\",");
        System.out.println("  \"expectedMacHex\": \"" + escapeJson(expectedMac.trim()) + "\",");
        System.out.println("  \"executionTimeMs\": " + String.format("%.3f", durationMs) + "");
        System.out.println("}");
    }

    private static String normalizeAlgo(String algo) {
        if (algo == null) return "CBC-MAC";
        String u = algo.toUpperCase();
        if (u.contains("CMAC")) return "CMAC-AES128";
        if (u.contains("CBC")) return "CBC-MAC-AES128";
        return "Keyed-MAC-AES";
    }

    private static byte[] prepareKeyBytes(String secretKey, int targetLen) {
        byte[] raw = secretKey.getBytes(StandardCharsets.UTF_8);
        byte[] key = new byte[targetLen];
        if (raw.length > targetLen) {
            System.arraycopy(raw, 0, key, 0, targetLen);
        } else {
            System.arraycopy(raw, 0, key, 0, raw.length);
        }
        return key;
    }

    private static byte[] padPkcs7(byte[] data, int blockSize) {
        int padLen = blockSize - (data.length % blockSize);
        byte[] padded = new byte[data.length + padLen];
        System.arraycopy(data, 0, padded, 0, data.length);
        for (int i = data.length; i < padded.length; i++) {
            padded[i] = (byte) padLen;
        }
        return padded;
    }

    private static byte[] padCmacBit100(byte[] data, int totalLen) {
        byte[] padded = new byte[totalLen];
        System.arraycopy(data, 0, padded, 0, data.length);
        padded[data.length] = (byte) 0x80; // append 1 bit followed by 0 bits
        return padded;
    }

    private static byte[] generateSubkey(byte[] L) {
        byte[] K = new byte[16];
        boolean overflow = (L[0] & 0x80) != 0;
        for (int i = 0; i < 15; i++) {
            K[i] = (byte) ((L[i] << 1) | ((L[i + 1] & 0x80) >>> 7));
        }
        K[15] = (byte) (L[15] << 1);
        if (overflow) {
            K[15] ^= 0x87; // Constant R128 = 0x00...087
        }
        return K;
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
        String cleaned = hex.replaceAll("[^0-9a-fA-F]", "");
        if (cleaned.length() % 2 != 0) cleaned = "0" + cleaned;
        byte[] data = new byte[cleaned.length() / 2];
        for (int i = 0; i < cleaned.length(); i += 2) {
            data[i / 2] = (byte) ((Character.digit(cleaned.charAt(i), 16) << 4)
                                 + Character.digit(cleaned.charAt(i + 1), 16));
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

    private static class BlockStep {
        int index;
        String plainHex;
        String xorHex;
        String encHex;

        BlockStep(int index, String plainHex, String xorHex, String encHex) {
            this.index = index;
            this.plainHex = plainHex;
            this.xorHex = xorHex;
            this.encHex = encHex;
        }
    }
}
