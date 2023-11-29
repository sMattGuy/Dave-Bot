const orderedJerk = (usersData) => {
    const listData = [];
    Object.keys(usersData).forEach(id => {
        listData.push(usersData[id]);
    });
    const orderedListData = listData.sort((a, b) => b.stats.jerks - a.stats.jerks);
    return orderedListData;
}

module.exports = orderedJerk;