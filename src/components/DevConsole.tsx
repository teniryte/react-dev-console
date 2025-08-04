import styled from 'styled-components';
import { LineType } from '../types/line.type';
import {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { LineTypeEnum } from '../types/line-type.enum';
import { ConsoleLine } from './ConsoleLine';
import { v4 as uuidv4 } from 'uuid';
import { formatTime } from '../util/format-time';
import { ConsolePrompt } from './ConsolePrompt';

const TIMERS: Record<string, number> = {};

const StyledDevConsole = styled.div`
  padding: 5px;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
  height: 35vh;
  background: oklch(20.8% 0.042 265.755);
  box-sizing: border-box;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 40px;
  color: #fff;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
`;

export const DevConsole = () => {
  const [consoleRef, setConsoleRef] = useState<HTMLDivElement | null>(null);
  const [code, setCode] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [lines, setLines] = useState<LineType[]>([
    {
      uid: uuidv4(),
      values: ['This is log'],
      type: LineTypeEnum.Log,
    },
    {
      uid: uuidv4(),
      values: ['This is debug'],
      type: LineTypeEnum.Debug,
    },
    {
      uid: uuidv4(),
      values: ['This is info'],
      type: LineTypeEnum.Info,
    },
    {
      uid: uuidv4(),
      values: ['This is eval'],
      type: LineTypeEnum.Eval,
    },
    {
      uid: uuidv4(),
      values: ['console.log("Hello, world!")'],
      type: LineTypeEnum.Error,
    },
  ]);

  const scrollToBottom = useCallback(() => {
    if (consoleRef) {
      consoleRef.scrollTop = consoleRef.scrollHeight;
    }
  }, [consoleRef]);

  const addLine = useCallback(
    () => (type: LineTypeEnum, values: any[]) => {
      setLines((prev) => [...prev, { uid: uuidv4(), type, values }]);
    },
    []
  );

  const startTimer = useCallback((name: string = 'default') => {
    TIMERS[name] = Date.now();
  }, []);

  const stopTimer = useCallback((name: string = 'default') => {
    const start = TIMERS[name];
    if (!start) {
      return;
    }
    const end = Date.now();
    const duration = end - start;
    addLine()(LineTypeEnum.Debug, [`${name}: ${formatTime(duration)}`]);
  }, []);

  const evalCode = useCallback(
    (code: string) => {
      setCode('');

      if (code === 'clear') {
        setLines([]);
        setCode('');
        startTransition(() => {
          addLine()(LineTypeEnum.Debug, ['console cleared']);
        });
        return;
      }

      addLine()(LineTypeEnum.Eval, [code]);

      try {
        const result = eval(code);
        addLine()(LineTypeEnum.Log, [result]);
      } catch (err) {
        addLine()(LineTypeEnum.Error, [err]);
      } finally {
        setHistoryIndex(0);
        setHistory((prev) => [...prev, code]);
        setCode('');
      }
    },
    [setCode]
  );

  const prevCode = useCallback(() => {
    setHistoryIndex((prev) => prev + 1);
    startTransition(() => {
      setCode(history[history.length - historyIndex - 1]);
    });
  }, [historyIndex]);

  const nextCode = useCallback(() => {
    setHistoryIndex((prev) => prev - 1);
    startTransition(() => {
      setCode(history[history.length - historyIndex + 1]);
    });
  }, [historyIndex]);

  const consoleExtension = useMemo(() => {
    return {
      log(...args: any) {
        addLine()(LineTypeEnum.Log, args);
      },
      debug(...args: any) {
        addLine()(LineTypeEnum.Debug, args);
      },
      info(...args: any) {
        addLine()(LineTypeEnum.Info, args);
      },
      error(...args: any) {
        addLine()(LineTypeEnum.Error, args);
      },
      time: startTimer,
      timeEnd: stopTimer,
    };
  }, [addLine, startTimer, stopTimer]);

  const originalConsole = useMemo(
    () => ({
      log: console.log,
      debug: console.debug,
      info: console.info,
      error: console.error,
      time: console.time,
      timeEnd: console.timeEnd,
    }),
    []
  );

  useLayoutEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  useEffect(() => {
    Object.assign(console, consoleExtension);

    return () => {
      Object.assign(console, originalConsole);
    };
  }, []);

  return (
    <>
      <StyledDevConsole ref={setConsoleRef}>
        {lines.map((line) => (
          <ConsoleLine key={line.uid} {...line} />
        ))}

        <ConsolePrompt
          value={code}
          onChange={setCode}
          onCommit={evalCode}
          onPrev={prevCode}
          onNext={nextCode}
        />
      </StyledDevConsole>
    </>
  );
};
