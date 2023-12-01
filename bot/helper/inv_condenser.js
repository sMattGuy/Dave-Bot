const invCondenser = (invData) => {
    const shortInv = {};
    invData.forEach(itemId => {
        if (!shortInv?.[itemId]) shortInv[itemId] = 1;
        else shortInv[itemId]++;
    });

    return shortInv;
}

module.exports = invCondenser;