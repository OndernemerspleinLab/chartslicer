//@flow

import { getCbsDataPropertiesPromise } from './getCbsDataPropertiesPromise'
import { getCbsCategorieByDimensionPromise } from './getCbsCategoriesByDimensionPromise'
import { getTableInfoPromise } from './getTableInfoPromise'
import { getTopicGroups } from './getTopicGroups'
import { getTopics } from './getTopics'
import { getDimensions } from './getDimensions'
import { getCategories } from './getCategories'
import { getCategoryGroups } from './getCategoryGroups'
import { fetchCategoryGroups } from './apiCalls'
import type { DatasetId } from '../store/stateShape'

const getFirstMetadataPromise = (id: DatasetId) =>
  Promise.all([
    getTableInfoPromise(id),
    getCbsDataPropertiesPromise(id),
    fetchCategoryGroups(id),
  ]).then(([tableInfo, cbsDataProperties, cbsCategoryGroups]) => ({
    tableInfo,
    cbsDataProperties,
    cbsCategoryGroups,
  }))

const addTopicsAndDimensions = ({ id, tableInfo, cbsDataProperties }) => ({
  id,
  tableInfo,
  topicGroups: getTopicGroups(id)(cbsDataProperties),
  topics: getTopics(id)(cbsDataProperties),
  dimensions: getDimensions(id)(cbsDataProperties),
})

const getSecondMetadataPromise = (id: DatasetId) => ({
  tableInfo,
  cbsDataProperties,
  cbsCategoryGroups,
}) =>
  Promise.all([
    addTopicsAndDimensions({
      id,
      tableInfo,
      cbsDataProperties,
    }),
    cbsCategoryGroups,
    getCbsCategorieByDimensionPromise(id)(cbsDataProperties),
  ])

const getThirdMetadaPromise = (id: DatasetId) => (
  [memo, cbsCategoryGroups, cbsCategoriesByDimension]
) => ({
  ...memo,
  categoryGroups: getCategoryGroups(id)({
    cbsCategoryGroups,
    cbsCategoriesByDimension,
  }),
  categories: getCategories(id)(cbsCategoriesByDimension),
})

export const getMetadataPromise = (id: DatasetId) =>
  getFirstMetadataPromise(id)
    .then(getSecondMetadataPromise(id))
    .then(getThirdMetadaPromise(id))
