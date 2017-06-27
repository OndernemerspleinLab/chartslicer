import React from 'react'
import {
  Step,
  StepTitle,
  GroupLabel,
  Radio,
  Form,
  FormRow,
  AccordionButton,
  CloseAccordion,
} from './Elements'
import glamorous from 'glamorous'
import { violet } from '../colors'
import { configChangeEnhancer } from '../enhancers/configEnhancers'
import { onlyWhenMetadataLoaded } from '../enhancers/metadataEnhancers'
import { compose, branch, renderNothing } from 'recompose'
import { topicEnhancer, topicGroupEnhancer } from '../enhancers/topicEnhancers'
import { unexisting } from '../helpers/helpers'
import { fadeInAnimation } from '../styles'

const RadioTopicUnit = compose(
  branch(({ children }) => unexisting(children), renderNothing)
)(
  glamorous.span({
    fontSize: '0.8rem',
    ':before': {
      content: '"("',
    },
    ':after': {
      content: '")"',
    },
  })
)

const TopicRadioComp = ({ title, unit, inputValue, onChange, name, value }) =>
  <Radio
    id={`topic-${inputValue}`}
    name={name}
    value={inputValue}
    onChange={onChange}
    checked={value === inputValue}
  >
    {title} <RadioTopicUnit>{unit}</RadioTopicUnit>
  </Radio>

const TopicRadio = compose(topicEnhancer, configChangeEnhancer)(TopicRadioComp)

const TopicGroupComp = glamorous.div(
  {
    animation: fadeInAnimation,
  },
  ({ topicGroupId }) =>
    topicGroupId === 'root'
      ? null
      : {
          paddingLeft: '0.3rem',
          borderLeft: `2px solid ${violet.default}`,
          marginBottom: '1rem',
        }
)

const TopicGroupContainer = ({
  title,
  topics = [],
  topicGroups = [],
  topicGroupId,
  asAccordion,
  includesSelection,
  toggle,
  close,
  opened,
}) => {
  const topicGroupHtmlId = `topicGroupLabel-${topicGroupId}`
  return (
    <TopicGroupComp
      topicGroupId={topicGroupId}
      aria-labelledby={topicGroupHtmlId}
      role={topicGroupId === 'root' ? 'radiogroup' : 'group'}
    >
      <GroupLabel id={topicGroupHtmlId}>
        {asAccordion
          ? <AccordionButton
              onClick={toggle}
              opened={opened}
              includesSelection={includesSelection}
            >
              {title}
            </AccordionButton>
          : title}
      </GroupLabel>
      {opened || !asAccordion
        ? <FormRow css={{ animation: fadeInAnimation }}>
            {topics.map(topicKey =>
              <TopicRadio key={topicKey} topicKey={topicKey} />
            )}
          </FormRow>
        : null}
      {opened || !asAccordion
        ? topicGroups.map(topicGroupId =>
            <TopicGroup key={topicGroupId} topicGroupId={topicGroupId} />
          )
        : null}
      {asAccordion && opened
        ? <CloseAccordion onClick={close}>Sluit {title}</CloseAccordion>
        : null}
    </TopicGroupComp>
  )
}

const TopicGroup = topicGroupEnhancer(TopicGroupContainer)

export const TopicPicker = onlyWhenMetadataLoaded(() =>
  <Step>
    <StepTitle sticky>Kies het onderwerp</StepTitle>
    <Form>
      <TopicGroup topicGroupId={'root'} title={'Onderwerpen'} />
    </Form>
  </Step>
)
