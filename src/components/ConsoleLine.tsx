import styled from 'styled-components';
import { ConsoleValue } from './ConsoleValue';
import { LineType } from '../types/line.type';
import { LineTypeEnum } from '../types/line-type.enum';

type ConsoleLineProps = LineType & {};

const StyledLine = styled.div<{ type: LineTypeEnum }>`
  color: #90a4ae;
  // border-bottom: 1px dotted rgba(255, 255, 255, 0.1);
  line-height: 1.1em;
  // padding-bottom: 5px;
  margin-bottom: 3px;
  padding: 4px 5px;
  border-radius: 4px;
  font-size: 12px;
  box-sizing: border-box;
  display: flex;
  gap: 5px;
  align-items: flex-start;
  transition: all 0.3s;

  &:hover {
    background: ${({ type }) => {
      switch (type) {
        case LineTypeEnum.Error:
          return 'rgba(255, 0, 0, 0.3)';
        default:
          return 'rgba(255, 255, 255, 0.05)';
      }
    }};
  }

  background: ${({ type }) => {
    switch (type) {
      case LineTypeEnum.Error:
        return 'rgba(255, 0, 0, 0.2)';
      default:
        return 'rgba(255, 255, 255, 0.025)';
    }
  }};

  color: ${({ type }) => {
    switch (type) {
      case LineTypeEnum.Log:
        return 'oklch(86.9% 0.022 252.894)';
      case LineTypeEnum.Error:
        return 'rgba(255, 255, 255, 0.6)';
      case LineTypeEnum.Info:
        return '#1e88e5';
      case LineTypeEnum.Debug:
        return 'oklch(70.4% 0.04 256.788)';
      case LineTypeEnum.Eval:
        return 'oklch(68.1% 0.162 75.834)';
    }
  }};

  &::before {
    content: '$';
    display: ${({ type }) => {
      switch (type) {
        case LineTypeEnum.Eval:
          return 'inline';
        default:
          return 'none';
      }
    }};
    position: static;
    color: rgba(255, 255, 255, 0.4);
    border: 1px solid transparent;
    border-radius: 3px;
    padding: 1px 0 1px 3px;
  }
`;

export const ConsoleLine = ({ values, type }: ConsoleLineProps) => {
  return (
    <StyledLine type={type}>
      {values.map((value) => (
        <ConsoleValue type={type} value={value} onClick={() => {}} />
      ))}
    </StyledLine>
  );
};
