// @flow

export type Key = string
export type KeyPath = Key[]

export type Id = number

export type DatasetId = string
export type MaybeDatasetId = ?DatasetId

///////// Network state /////////

export type NetworkState = {
  id: DatasetId,
  loading: boolean,
  loaded: boolean,
  error: ?Error,
}

///////// Table info /////////

export type PeriodType = string

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
}

export type CategoryGroup = CategoryGroupRoot & {
  title?: string,
}

export type CategoryGroups = {
  id: DatasetId,
  [DimensionKey]: {
    root: CategoryGroupRoot,
    [CategoryGroupId]: CategoryGroup,
  },
}

export type Category = {
  dimensionKey: DimensionKey,
  key: CategoryKey,
  title: string,
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
  topicKey: TopicKey[],
  categoryKeys: {
    [DimensionKey]: CategoryKey[],
  },
}

///////// Dataset /////////

export type DataEntry = {
  id: Id,
  [TopicKey | DimensionKey]: number | CategoryKey,
}

export type Dataset = {
  id: DatasetId,
  data: DataEntry[],
}

///////// Full State /////////

export type State = {
  activeDatasetId: MaybeDatasetId,
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
  datasets: {
    [DatasetId]: Dataset,
  },
  dataInfoNetworkState: {
    [DatasetId]: NetworkState,
  },
  datasetNetworkState: {
    [DatasetId]: NetworkState,
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
  | Dataset
  | NetworkState
