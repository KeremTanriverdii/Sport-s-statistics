export function slugify(text: string): string {
    const trMap: { [key: string]: string } = {
        ç: 'c', Ç: 'C',
        ğ: 'g', Ğ: 'G',
        ı: 'i', İ: 'I',
        ö: 'o', Ö: 'O',
        ş: 's', Ş: 'S',
        ü: 'u', Ü: 'U'
    };

    return text
        .replace(/[\s]+/g, '-') // boşlukları tireye çevir
        .replace(/[çÇğĞıİöÖşŞüÜ]/g, (match) => trMap[match])
        .replace(/[^a-zA-Z0-9-]/g, '') // geçersiz karakterleri sil
        .toLowerCase();
}
