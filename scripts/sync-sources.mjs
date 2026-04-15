import {
  fetchTrackedItemsForSource,
  mergeFetchedItems,
  readSourceRegistry,
  readTrackedSourceItems,
  writeDerivedSourceFiles,
  writeTrackedSourceItems,
} from './source-common.mjs';

async function main() {
  const registry = await readSourceRegistry();
  const existingItems = await readTrackedSourceItems();
  const nextItems = [];
  let syncedSources = 0;

  for (const source of registry) {
    if (source.active === false || !source.feedUrl) {
      continue;
    }

    const currentSourceItems = existingItems.filter((item) => item.sourceId === source.id);

    try {
      const fetchedItems = await fetchTrackedItemsForSource(source);
      const mergedItems = mergeFetchedItems(source, fetchedItems, currentSourceItems);
      nextItems.push(...mergedItems);
      syncedSources += 1;
    } catch (error) {
      console.warn(
        `Skipping ${source.title}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      nextItems.push(...currentSourceItems);
    }
  }

  const writtenItems = await writeTrackedSourceItems(nextItems);
  await writeDerivedSourceFiles(registry, writtenItems);

  console.log(
    `Synced ${syncedSources} tracked feeds and wrote ${writtenItems.length} tracked items.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
