class MapEvolutionist {
    static generateFirstGeneration(entityCount) {
        let entities = [];
        for (let i = 1; i <= entityCount; i++) {
            let entity = MapGenerator.generate()
            entities.push(entity);
        }

        return entities;
    }

    static generateNextGeneration(currentGeneration) {
        let generationSize = currentGeneration.length;

        let entitiesScores = [];
        currentGeneration.forEach(entity => {
            entitiesScores.push({
                "entity": entity,
                "score": MapEvaluator.evaluateMapScore(entity)
            });
        });

        let bestEntitiesCount = Math.ceil(generationSize / 2);
        let bestEntities = entitiesScores.sort((a, b) => {
            return b.score - a.score;
        }).slice(0, bestEntitiesCount);

        console.log(bestEntities.map(entity => entity.score));
        let newGeneration = [];
        for (let i = 0; i < bestEntitiesCount; i++) {
            for (let j = i; j < bestEntitiesCount; j++) {
                if (i == j) {
                    continue;
                }
                let entityFromNewGeneration = MapCrosser.crossMaps(
                    bestEntities[i].entity, bestEntities[j].entity);

                newGeneration.push(entityFromNewGeneration);
            }
        }

        return newGeneration;
    }
}