const invCondenser = (invData) => {
    const shortInv = {};
    invData.forEach(item => {
        if (!shortInv?.[item]) shortInv[item] = 1;
        else shortInv[item]++;
    });

    return shortInv;
}

module.exports = invCondenser;