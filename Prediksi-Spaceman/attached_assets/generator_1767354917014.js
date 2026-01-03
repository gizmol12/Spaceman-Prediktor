function generateMultiplier() {
    const dataRisiko = [
        { warna: "bg-blue-500 border-blue-300 shadow-[0_0_25px_rgba(59,130,246,0.6)]", label: "SAFE" },
        { warna: "bg-yellow-500 border-yellow-300 shadow-[0_0_25px_rgba(234,179,9,0.6)]", label: "RISKY" },
        { warna: "bg-red-600 border-red-400 shadow-[0_0_25px_rgba(220,38,38,0.6)]", label: "DANGER" }
    ];

    for (let i = 1; i <= 5; i++) {
        let slot = document.getElementById("slot-" + i);
        if (!slot) continue;

        slot.className = "w-20 h-28 rounded-2xl border-2 border-indigo-500 bg-slate-800 flex items-center justify-center text-xl font-black text-indigo-400 animate-pulse";

        let spinner = setInterval(() => {
            let angkaAcak = (Math.random() * 9.9).toFixed(2);
            slot.innerText = `x${angkaAcak}`;
        }, 50);

        setTimeout(() => {
            clearInterval(spinner);

            let angkaUtama = Math.floor(Math.random() * 100) + 1;
            let angkaDesimal = Math.floor(Math.random() * 10);
            let hasilPerkalian = `x${angkaUtama}.${angkaDesimal}`;
            let pilihan = dataRisiko[Math.floor(Math.random() * dataRisiko.length)];

            slot.innerText = hasilPerkalian;
            slot.className = `w-20 h-28 rounded-2xl border-2 flex items-center justify-center text-xl font-black transition-all duration-300 text-white ${pilihan.warna} scale-110`;

            setTimeout(() => { slot.classList.remove('scale-110'); }, 200);

            let historyContainer = document.getElementById("history-list");
            if (historyContainer) {
                let items = document.createElement("div");
                items.className = "bg-slate-900/40 border border-white/5 p-3 rounded-xl flex justify-between items-center animate-fadeIn mb-2";

                let warnaTeks = pilihan.warna.split(' ')[0];

                items.innerHTML = `
                    <span class="text-slate-400 text-[10px] font-mono">${new Date().toLocaleTimeString()}</span>
                    <span class="font-black ${warnaTeks} italic text-sm text-white">${hasilPerkalian}</span>
                `;

                historyContainer.prepend(items);

                if (historyContainer.children.length > 5) {
                    historyContainer.lastChild.remove();
                }
            }
        }, 1000 + (i * 300));
    }
}