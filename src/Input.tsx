import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { throttle } from 'lodash';

const Base = styled.div`
  width: 500px;
  background-color: aliceblue;
`;

const InputContainer = styled.input`
  width: calc(100% - 10px);
  height: 50px;
  border: 1px solid lightgray;
  font-size: 20px;
  padding: 5px;
`;

const DropdownContainer = styled.div`
  background-color: #e5e5e5;
  width: calc(100% + 2px);
`;

const DropdownList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const DropdownEl = styled.li`
  padding: 10px 5px;
  cursor: pointer;

  &:hover {
    background-color: lightgray;
  }

  &.focused {
    background-color: lightgray;
  }
`;

const Input = () => {
  const [inputText, setInputText] = useState("");
  const [simVals, setSimVals] = useState<string[]>([]);
  const [hasSimVals, setHasSimVals] = useState(false);
  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const [curIndex, setCurIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);

  const wordList = ["Next.js", "Java", "Javascript", "Typescript", "Python", "C", "C++", "SQL", "Scala", "React", "Vue.js"];

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _throttle = throttle((val: string) => {
      setInputText(val);
    }, 3000);

    _throttle(e.target.value);
  }

  const getSimilarValues = () => {
    if (inputText.length > 0) {
      const similarValues = wordList.filter((word) => 
        word.toLowerCase().slice(0,inputText.length)===inputText.toLowerCase()
      );
      setSimVals(similarValues);
      setHasSimVals(true);
      // console.log("curIndex",curIndex);
    }
    else {
      setSimVals([]);
      setHasSimVals(false);
    }
  }

  const simValOnClick = (val: string) => {//자동완성 클릭했을 때
    if (inputRef.current){
      inputRef.current.value = val;
      setInputText(val);
    }
  }

  const simValsOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (hasSimVals) {//자동완성 목록이 있으면
      if (e.key === "ArrowDown") {
        setCurIndex((curIndex+1) % simVals.length);
      } else if (e.key === "ArrowUp") {
        if (curIndex === 0) 
          setCurIndex(simVals.length - 1);
        else
          setCurIndex((curIndex-1) % simVals.length);
      }
    }
  }

  useEffect(() => {
    getSimilarValues();
  }, [inputText]);//입력할 때

  useEffect(() => {
    if (hasSimVals) setIsDropdownShown(true);
  }, [hasSimVals]);

  useEffect(() => {
    const mouseDownHandler = (ev: MouseEvent) => {
      if (baseRef.current && !baseRef.current.contains(ev.target as Node))
        setIsDropdownShown(false);
      else setIsDropdownShown(true);
    }

    document.addEventListener("mousedown",mouseDownHandler);
  }, []);

  
  return (
    <Base ref={baseRef}>
      <InputContainer 
        onKeyDown={simValsOnKeyDown}
        onChange={inputOnChange} 
        ref={inputRef} 
      />
      {isDropdownShown && (
        <DropdownContainer>
          <DropdownList>
            {simVals.map((val, idx) =>
              <DropdownEl 
                onClick={() => simValOnClick(val)}
                className={(idx===curIndex) ? "focused" : ""} 
              >
                {val}
              </DropdownEl>
            )}
          </DropdownList>
        </DropdownContainer>
      )}
    </Base>

  )
}

export default Input