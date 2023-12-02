exports.useItem = async (interaction, itemId) => {
    switch (itemId) {
        case semen_seeker:
            await semenSeeker(interaction);
            break;
    }
}