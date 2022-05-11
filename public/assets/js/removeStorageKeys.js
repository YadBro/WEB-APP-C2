window.onbeforeunload = function () {
    return 'If you reload, refresh, redirect, and close. data will be removed!';
}

function removeStorageItem() {
    // Dapatkan performance entries data
    const perfEntries = performance.getEntriesByType("navigation");

    // Looping performance entries data
    for (let i = 0; i < perfEntries.length; i++) {
        // Dapatkan performance entries data
        let p = perfEntries[i];
        // Cek jika tipe data entrynya reload
        if (p.type === 'reload') {
            // Hapus data sementaranya
            // const keyName = localStorage.key(0);
            // localStorage.removeitem(keyName);
        }

    }
}

removeStorageItem();