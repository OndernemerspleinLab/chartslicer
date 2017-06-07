import React from 'react'
import { Step, StepTitle, Label, Radio, Form, FormRow } from './Elements'
import glamorous from 'glamorous'
import { violet } from '../colors'
import { configChangeEnhancer } from '../enhancers/configEnhancers'
import { onlyWhenMetadataLoaded } from '../enhancers/metadataEnhancers'
import { compose } from 'recompose'
import { topicEnhancer, topicGroupEnhancer } from '../enhancers/topicEnhancers'

const TopicRadioComp = ({ title, inputValue, onChange, name, value }) =>
  <Radio
    id={`topic-${inputValue}`}
    name={name}
    value={inputValue}
    onChange={onChange}
    checked={value === inputValue}
  >
    {title}
  </Radio>

const TopicRadio = compose(topicEnhancer, configChangeEnhancer)(TopicRadioComp)

const TopicGroupComp = glamorous.div(
  ({ topicGroupId }) =>
    topicGroupId === 'root'
      ? null
      : {
          paddingLeft: '0.3rem',
          borderLeft: `2px solid ${violet.default}`,
        }
)

const TopicGroupContainer = ({
  title,
  topics = [],
  topicGroups = [],
  topicGroupId,
}) =>
  <TopicGroupComp topicGroupId={topicGroupId}>
    <Label>{title}</Label>
    <FormRow>
      {topics.map(topicKey =>
        <TopicRadio key={topicKey} topicKey={topicKey} />
      )}
    </FormRow>
    {topicGroups.map(topicGroupId =>
      <TopicGroup key={topicGroupId} topicGroupId={topicGroupId} />
    )}
  </TopicGroupComp>

const TopicGroup = topicGroupEnhancer(TopicGroupContainer)

export const TopicPicker = onlyWhenMetadataLoaded(() =>
  <Step>
    <StepTitle>Kies het onderwerp</StepTitle>
    <Form>
      <TopicGroup topicGroupId={'root'} title={'Onderwerpen'} />
    </Form>
  </Step>
)
