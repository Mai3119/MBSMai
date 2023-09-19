export function compressToBase64(input: any): string;
export function decompressFromBase64(input: any): string;
export function compressToUTF16(input: any): string;
export function decompressFromUTF16(compressed: any): string;
export function compressToUint8Array(uncompressed: any): Uint8Array;
export function decompressFromUint8Array(compressed: any): string;
export function compressToEncodedURIComponent(input: any): string;
export function decompressFromEncodedURIComponent(input: any): string;
export function compress(uncompressed: any): string;
export function _compress(uncompressed: any, bitsPerChar: any, getCharFromInt: any): string;
export function decompress(compressed: any): string;
export function _decompress(length: any, resetValue: any, getNextValue: any): string;