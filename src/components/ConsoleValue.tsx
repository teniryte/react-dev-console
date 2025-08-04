import { debugString } from 'kit';
import styled from 'styled-components';
import { LineTypeEnum } from '../types/line-type.enum';
import { startTransition } from 'react';

console.log('ERROR', '<' + debugString(new Error('test')) + '>');

const StyledValue = styled.pre<{ type: LineTypeEnum }>`
  cursor: pointer;
  transition: all 0.3s;
  display: inline-block;
  font-family: monospace;
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 3px;
  padding: 1px 3px;
  white-space: pre-wrap; /* сохраняет переносы и пробелы */
  word-wrap: break-word; /* старый способ, для совместимости */
  overflow-wrap: break-word; /* современный стандарт */

  &:hover {
    border-color: ${({ type }) =>
      [LineTypeEnum.Error, LineTypeEnum.Eval].includes(type)
        ? 'transparent'
        : 'rgba(255, 255, 255, 0.2)'};
  }
`;

export const ConsoleValue = ({
  value,
  onClick,
  type,
}: {
  value: any;
  type: LineTypeEnum;
  onClick: () => void;
}) => {
  const s = debugString(value);

  const valueClicked = () => {
    if ([LineTypeEnum.Error, LineTypeEnum.Eval].includes(type)) {
      return;
    }
    onClick();
  };

  return (
    <StyledValue type={type} onClick={valueClicked}>
      {s}
    </StyledValue>
  );
};
