import React, { useEffect, useState } from "react";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import "./App.css";

const defaultRange = 10;

interface NumbersMap {
    [key: number]: number | undefined;
}

const App: React.FC = () => {
    const [range, setRange] = useState<number>(defaultRange);
    const [win, setWin] = useState<boolean>(false);
    const [tries, setTries] = useState<number>(0);
    const [inputNumbers, setInputNumbers] = useState<NumbersMap>({
        1: undefined,
        2: undefined,
        3: undefined,
        4: undefined,
        5: undefined,
        6: undefined,
    });
    const [winNumbers, setWinNumbers] = useState<NumbersMap>(generateWinNumbers(defaultRange));
    const [start, setStart] = useState<boolean>(false);

    useEffect(() => {
        // @ts-ignore
        let interval: NodeJS.Timeout | null = null;
        if (start) {
            interval = setInterval(() => {
                setWinNumbers(generateWinNumbers(range));
                setTries((prev) => prev + 1);
                if (checkWin(inputNumbers, winNumbers)) {
                    setWin(true);
                    setStart(false);
                }
            }, 10);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [start, inputNumbers, range, winNumbers]);

    const handleRangeChange = (e: InputNumberChangeEvent) => {
        const newRange = e.value as number;
        setRange(newRange);
        setWinNumbers(generateWinNumbers(newRange));
    };

    const handleInputNumberChange = (key: number, value: number | undefined) => {
        if (value && value > range) {
            alert(`Number cannot be greater than the range: ${range}`);
            return;
        }
        const newInputNumbers: NumbersMap = { ...inputNumbers, [key]: value };
        setInputNumbers(newInputNumbers);
    };

    // @ts-ignore
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-2">
            <h2 className="mt-2 text-2xl font-semibold">Tries: {tries}</h2>
            <h2 className="mt-2 text-2xl font-semibold">Win: {win ? "Yes" : "No"}</h2>
            <div className="flex flex-col items-center mt-2 bg-white p-2 shadow-md rounded w-full">
                <label htmlFor="range" className="text-lg font-medium">
                    Range from 1 to 45? <br/>(default 10, min 1, max 45)
                </label>
                <InputNumber
                    id="range"
                    className="mt-2 w-24 text-center bg-gray-200 rounded p-2 shadow-md"
                    value={range}
                    style={{
                        fontSize: "1.5rem",
                    }}
                    // @ts-ignore
                    onValueChange={handleRangeChange}
                    max={45}
                    min={1}
                    showButtons={true}
                    buttonLayout="vertical"
                />
            </div>
            <h4 className="mt-2 text-xl font-medium">Win Numbers Loop:</h4>
            <div className="card flex flex-row gap-2 mt-2 p-2 border border-gray-300 rounded bg-white shadow-md">
                {Object.values(winNumbers).map((number, index) => (
                    <div key={index}
                         className="number p-2 bg-gray-200 rounded text-center w-12 h-12 flex items-center justify-center text-lg font-bold">
                        {number}
                    </div>
                ))}
            </div>
            <h3 className="mt-2 text-xl font-medium">Input Your Numbers:</h3>
            <div className="card flex flex-row gap-2 mt-2">
                {Object.keys(inputNumbers).map((key) => (
                    <InputNumber
                        key={key}
                        value={inputNumbers[parseInt(key)]}
                        onValueChange={(e) => handleInputNumberChange(parseInt(key), e.value as number | undefined)}
                        mode="decimal"
                        placeholder=""
                        style={{width: "50px", fontSize: "1.5rem"}}
                        className="text-center bg-gray-200 rounded p-2 shadow-md"
                        min={1}
                        max={range}
                        showButtons={true}
                        buttonLayout="vertical"
                    />
                ))}
            </div>
            <div className="flex flex-col items-center mt-2 gap-2">
                <button onClick={resetLottery}
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition">
                    Reset
                </button>
                <button onClick={startLotteryWithRandomNumbers}
                        className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-700 transition">
                    Get Random Numbers And Start
                </button>
                <button onClick={startLottery}
                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700 transition">
                    Start!!!
                </button>
                <button onClick={stopLottery}
                        className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-700 transition">
                    Stop
                </button>
            </div>
        </div>
    );

    function generateWinNumbers(range: number): NumbersMap {
        const newWinNumbers: NumbersMap = {};
        for (let i = 1; i <= 6; i++) {
            newWinNumbers[i] = Math.floor(Math.random() * range) + 1;
        }
        return newWinNumbers;
    }

    function checkWin(inputNumbers: NumbersMap, winNumbers: NumbersMap): boolean {
        return Object.values(inputNumbers).every((value, index) => value === winNumbers[index + 1]);
    }

    function startLottery() {
        if (Object.values(inputNumbers).some((value) => value === undefined)) {
            alert("Please fill in all numbers");
            return;
        }
        setWinNumbers(generateWinNumbers(range));
        setStart(true);
    }

    function startLotteryWithRandomNumbers() {
        setTries(0);
        setWin(false);
        setWinNumbers(generateWinNumbers(range));

        const newInputNumbers: NumbersMap = {};
        for (let i = 1; i <= 6; i++) {
            newInputNumbers[i] = Math.floor(Math.random() * range) + 1;
        }
        setInputNumbers(newInputNumbers);
        setStart(true);
    }

    function stopLottery() {
        setStart(false);
    }

    function resetLottery() {
        setWinNumbers(generateWinNumbers(range));
        setInputNumbers({
            1: undefined,
            2: undefined,
            3: undefined,
            4: undefined,
            5: undefined,
            6: undefined,
        });
        setTries(0);
        setWin(false);
        setStart(false);
    }
};

export default App;
