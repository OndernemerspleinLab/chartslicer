import React from 'react'
import { Step, StepTitle, Label, Radio, Form, FormRow } from './Elements'
import {
  connectActiveDataset,
  getFromActiveDataset,
} from '../reducers/datasetsReducer'
import { onlyWhenLoaded, connectConfigChange } from '../higherOrderComponents'
import { connect } from 'react-redux'
import glamorous from 'glamorous'
import { violet } from '../colors'

const TopicRadioComp = ({ title, inputValue, onChange, name, value }) => (
  <Radio
    id={`topic-${inputValue}`}
    name={name}
    value={inputValue}
    onChange={onChange}
    checked={value === inputValue}
  >
    {title}
  </Radio>
)

const TopicRadio = connectConfigChange(TopicRadioComp)

const connectTopicsForGroup = connect((state, { topicGroupId }) =>
  getFromActiveDataset({
    topics: ['dataProperties', 'Topic', topicGroupId],
    topicGroups: ['dataProperties', 'TopicGroup', topicGroupId],
  })(state)
)

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
}) => (
  <TopicGroupComp topicGroupId={topicGroupId}>
    <Label>{title}</Label>
    <FormRow>
      {topics.map(({ Title, Key }) => (
        <TopicRadio title={Title} inputValue={Key} name={'topicId'} key={Key} />
      ))}
    </FormRow>
    {topicGroups.map(({ Title, ID }) => (
      <TopicGroup title={Title} topicGroupId={ID} key={ID} />
    ))}
  </TopicGroupComp>
)
const TopicGroup = connectTopicsForGroup(TopicGroupContainer)

const TopicPickerContainer = ({ topics, topicGroups = [] }) => (
  <TopicGroup key={'root'} topicGroupId={'root'} title={'Onderwerpen'} />
)

const connectRootTopicGroups = connectActiveDataset({
  topicGroups: ['dataProperties', 'TopicGroup', 'root'],
})

const TopicPicker = connectRootTopicGroups(TopicPickerContainer)

export const YAxis = onlyWhenLoaded(() => (
  <Step>
    <StepTitle>Kies het onderwerp voor de y-as</StepTitle>
    <Form>
      <TopicPicker />
    </Form>
  </Step>
))
