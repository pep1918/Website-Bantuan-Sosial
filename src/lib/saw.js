export function hitungSAW(dataWarga) {
    if (!dataWarga || dataWarga.length === 0) return [];

    // 1. Tentukan Bobot BARU (Total harus 1.0)
    // C1: Penghasilan (0.5)
    // C2: Tanggungan (0.3)
    // C3: Pekerjaan (0.2) - Dulu ini C4, sekarang jadi kriteria ke-3
    const W = { c1: 0.5, c2: 0.3, c3: 0.2 };

    // 2. Cari Nilai Min/Max
    const penghasilanVals = dataWarga.map(w => w.penghasilan);
    const tanggunganVals = dataWarga.map(w => w.tanggungan);
    const kerjaVals = dataWarga.map(w => w.status_pekerjaan);

    const minC1 = Math.min(...penghasilanVals); // Cost
    const maxC2 = Math.max(...tanggunganVals);  // Benefit
    const maxC3 = Math.max(...kerjaVals);       // Benefit (Pekerjaan)

    // 3. Hitung Normalisasi
    const hasilRanking = dataWarga.map(w => {
        // R1 (Cost): Min / Nilai
        const R1 = w.penghasilan === 0 ? 0 : minC1 / w.penghasilan;
        
        // R2 (Benefit): Nilai / Max
        const R2 = maxC2 === 0 ? 0 : w.tanggungan / maxC2;

        // R3 (Benefit - Pekerjaan): Nilai / Max
        const R3 = maxC3 === 0 ? 0 : w.status_pekerjaan / maxC3;

        // Hitung Nilai Akhir (V) tanpa Kondisi Rumah
        const skor = (R1 * W.c1) + (R2 * W.c2) + (R3 * W.c3);

        return {
            ...w._doc, 
            skor_saw: skor.toFixed(4)
        };
    });

    return hasilRanking.sort((a, b) => b.skor_saw - a.skor_saw);
}