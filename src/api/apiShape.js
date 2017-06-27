// @flow

import type {
  TopicKey,
  Id,
  DimensionKey,
  CategoryGroupId,
  CategoryKey,
  DimenisionType,
  DataEntry,
} from '../store/stateShape'

///////// CbsTableInfo /////////

export type CbsTableInfo = {
  Title: string,
  GraphTypes: string[],
}

export type CbsTableInfoPromise = Promise<CbsTableInfo>

///////// CbsTopic /////////

export type CbsTopicType = 'Topic'

export type CbsTopic = {
  Key: TopicKey,
  Title: string,
  Unit: string,
  Decimals: number,
  ParentID: Id,
  Type: CbsTopicType,
}

///////// CbsTopicGroup /////////

export type CbsTopicGroupType = 'TopicGroup'

export type CbsTopicGroup = {
  Title?: string,
  ID: Id | 'root',
  ParentID?: Id,
  Type: CbsTopicGroupType,
}

///////// CbsDimenion /////////

export type CbsDimension = {
  ID: Id,
  ParentID: Id,
  Key: DimensionKey,
  Title: string,
  Type: DimenisionType,
}

export type CbsDimensions = CbsDimension[]

///////// CbsDataProperty /////////

export type CbsDataProperty = CbsTopic | CbsTopicGroup | CbsDimension

export type CbsDataProperties = CbsDataProperty[]

export type CbsDataPropertiesPromise = Promise<CbsDataProperties>

///////// CbsCategories /////////

export type CbsCategory = {
  Key: CategoryKey,
  Title: string,
  CategoryGroupID: CategoryGroupId,
}

export type CbsCategories = CbsCategory[]

export type CbsCategoriesPromise = Promise<CbsCategories>

///////// CategoryGroups /////////

export type CbsCategoryGroup = {
  ID: CategoryGroupId | 'root',
  DimensionKey: DimensionKey,
  Title?: string,
  ParentID?: Id,
}

export type CbsCategoryGroups = CbsCategoryGroup[]

export type CbsCategoryGroupsPromise = Promise<CbsCategoryGroups>

///////// CbsPeriods /////////
export type CbsPeriodKey = string

export type CbsPeriod = {
  Key: CbsPeriodKey,
}

export type CbsPeriods = CbsPeriod[]

export type CbsPeriodsPromise = Promise<CbsPeriods>

///////// DataEntries /////////

export type CbsDataEntry = {
  ID: Id,
  Perioden: CbsPeriodKey,
  [TopicKey]: number,
}

export type CbsDataEntries = CbsDataEntry[]

export type CbsDataEntriesPromise = Promise<CbsDataEntries>

export type DataEntriesPromise = Promise<DataEntry[]>
