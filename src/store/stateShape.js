// @flow

export type Key = string
export type KeyPath = Key[]

export type Id = number

export type DataEntryId = Id
export type DatasetId = string
export type MaybeDatasetId = ?DatasetId

export type DatasetQuery = string

///////// Network state /////////

export type NetworkState = {
  loading: boolean,
  loaded: boolean,
  error: ?Error,
  id: DatasetId,
}

export type MetadataNetworkState = NetworkState

export type DatasetQueryNetworkState = {
  query: DatasetQuery,
} & NetworkState

export type DataQueryNetworkState = {
  [DatasetQuery]: DatasetQueryNetworkState,
}

///////// Table info /////////

export type PeriodType = 'Jaar' | 'Maanden' | 'Kwartalen'

export type TableInfo = {
  title: string,
  id: DatasetId,
  graphTypes: string[],
  periodTypes: PeriodType[],
}

///////// Topics /////////

export type TopicKey = Key | 'root'

export type TopicGroupId = Id | 'root'

export type TopicGroupRoot = {
  id: TopicGroupId,
  topics: TopicKey[],
  topicGroups: TopicGroupId[],
}

export type TopicGroup = TopicGroupRoot & {
  title?: string,
}

export type TopicGroups = {
  id: DatasetId,
  root: TopicGroupRoot,
  [TopicGroupId]: TopicGroup,
}

export type Topic = {
  key: TopicKey,
  title: string,
  unit: string,
  decimals: number,
}

export type Topics = {
  id: DatasetId,
  [TopicKey]: Topic,
}

///////// Categories /////////

export type CategoryKey = Key
export type CategoryGroupId = Id
export type DimensionKey = Key

export type CategoryGroupKeyPath = [DimensionKey, CategoryGroupId]

export type CategoryGroupRoot = {
  id: CategoryGroupId | 'root',
  dimensionKey: DimensionKey,
  categories: CategoryKey[],
  categoryGroups: CategoryGroupId[],
  parentId: ?CategoryGroupId,
}

export type CategoryGroup = CategoryGroupRoot & {
  title?: string,
}

export type CategoryGroupsForDimension = {
  root: CategoryGroupRoot,
  [CategoryGroupId]: CategoryGroup,
}

export type CategoryGroups = {
  id: DatasetId,
  [DimensionKey]: CategoryGroupsForDimension,
}

export type Category = {
  dimensionKey: DimensionKey,
  key: CategoryKey,
  title: string,
  parentGroupIds: CategoryGroupId[],
}

export type Categories = {
  id: DatasetId,
  [DimensionKey]: {
    [CategoryKey]: Category,
  },
}

///////// Dimensions /////////

export type DimenisionType = 'Dimension' | 'TimeDimension' | 'GeoDimension'

export type Dimension = {
  type: DimenisionType,
  title: string,
  key: DimensionKey,
}

export type Dimensions = {
  id: DatasetId,
  order: DimensionKey[],
  [DimensionKey]: Dimension,
}

///////// Config state /////////

export type ConfigState = {
  id: DatasetId,
  periodType: PeriodType,
  periodLength: number,
  topicKeys: TopicKey[],
  categoryKeys: {
    [DimensionKey]: CategoryKey[],
  },
}

///////// Dataset /////////

export type DataEntry = {
  id: DataEntryId,
  periodDate: Date,
  periodType: PeriodType,
  [TopicKey | DimensionKey]: number | CategoryKey,
}

export type DataEntries = {
  id: DatasetId,
  [DataEntryId]: DataEntry,
}

export type DataQuery = {
  query: DatasetQuery,
  dataList: DataEntryId[],
} & ConfigState

export type DataQueries = {
  id: DatasetId,

  [DatasetQuery]: DataQuery,
}

export type DatasetQueries = {
  [DatasetId]: ?DatasetQuery,
}

///////// Full State /////////

export type State = {
  now: Date,
  activeDatasetId: MaybeDatasetId,
  activeDatasetQueries: DatasetQueries,
  visibleDatasetQueries: DatasetQueries,
  config: {
    [DatasetId]: ConfigState,
  },
  tableInfo: {
    [DatasetId]: TableInfo,
  },
  topicGroups: {
    [DatasetId]: TopicGroups,
  },
  topics: {
    [DatasetId]: Topics,
  },
  dimensions: {
    [DatasetId]: Dimensions,
  },
  categoryGroups: {
    [DatasetId]: CategoryGroups,
  },
  categories: {
    [DatasetId]: Categories,
  },
  dataEntries: {
    [DatasetId]: DataEntries,
  },
  dataQueries: {
    [DatasetId]: DataQueries,
  },
  metadataLoadingState: {
    [DatasetId]: MetadataNetworkState,
  },
  datasetLoadingState: {
    [DatasetId]: DataQueryNetworkState,
  },
}

export type Substate =
  | ConfigState
  | TableInfo
  | TopicGroups
  | Topics
  | Dimensions
  | CategoryGroups
  | Categories
  | MetadataNetworkState
  | DataQueryNetworkState
  | DataEntries
  | DataQueries
  | DatasetQueries
