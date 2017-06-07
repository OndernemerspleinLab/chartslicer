import React from 'react'
import { Step, StepTitle, Label, Radio, Form, FormRow } from './Elements'
import glamorous from 'glamorous'
import { violet } from '../colors'
import { configChangeEnhancer } from '../enhancers/configEnhancers'
import { onlyWhenMetadataLoaded } from '../enhancers/metadataEnhancers'
import { compose } from 'recompose'
import {
  categoryEnhancer,
  categoryGroupEnhancer,
} from '../enhancers/categoryEnhancers'
import { dimensionForKeyEnhancer } from '../enhancers/dimensionEnhancers'

const CategoryRadioComp = ({
  title,
  dimensionKey,
  inputValue,
  onChange,
  name,
  value,
}) =>
  <Radio
    id={`category-${dimensionKey}-${inputValue}`}
    name={name}
    value={inputValue}
    onChange={onChange}
    checked={value === inputValue}
  >
    {title}
  </Radio>

const CategoryRadio = compose(categoryEnhancer, configChangeEnhancer)(
  CategoryRadioComp
)

const CategoryGroupComp = glamorous.div(
  ({ categoryGroupId }) =>
    categoryGroupId === 'root'
      ? null
      : {
          paddingLeft: '0.3rem',
          borderLeft: `2px solid ${violet.default}`,
        }
)

const CategoryGroupContainer = ({
  title,
  dimensionKey,
  categories = [],
  categoryGroups = [],
  categoryGroupId,
}) =>
  <CategoryGroupComp categoryGroupId={categoryGroupId}>
    <Label>{title}</Label>
    <FormRow>
      {categories.map(categoryKey =>
        <CategoryRadio
          key={categoryKey}
          categoryKey={categoryKey}
          dimensionKey={dimensionKey}
        />
      )}
    </FormRow>
    {categoryGroups.map(categoryGroupId =>
      <CategoryGroup
        key={categoryGroupId}
        categoryGroupId={categoryGroupId}
        dimensionKey={dimensionKey}
      />
    )}
  </CategoryGroupComp>

const CategoryGroup = categoryGroupEnhancer(CategoryGroupContainer)

export const CategoryPicker = compose(
  onlyWhenMetadataLoaded,
  dimensionForKeyEnhancer
)(({ dimensionKey, title }) =>
  <Step>
    <StepTitle>Filter op ‘{title}’</StepTitle>
    <Form>
      <CategoryGroup
        categoryGroupId={'root'}
        dimensionKey={dimensionKey}
        title={'Categorieën'}
      />
    </Form>
  </Step>
)
