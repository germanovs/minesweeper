import { useState, useEffect } from 'react'
import './App.scss'

function App() {


	const [minesCount, setMinesCount] = useState<number>(10);
	const [gameMap, setGameMap] = useState<boolean[]>([]);
	const [grid, setGrid] = useState<boolean[][]>([]);

	const createNewGame = () => {
		const newGameMap = new Array(100).fill(false);
		let minesLocations: number[] = [];
		while (minesLocations.length < minesCount) {
			const randomIndex = Math.floor(Math.random() * 100);
			if (!minesLocations.includes(randomIndex)) {
				minesLocations.push(randomIndex);
			}
		}

		minesLocations.forEach((mineLocation) => {
			newGameMap[mineLocation] = true;
		});
		setGameMap(newGameMap);
	}

	useEffect(() => {
		createNewGame();
	}, []);

	return (
	<div className='container'>
		<h1>Minesweeper</h1>
		<div className='playfield'>

			<div className='grid'>
				{
					gameMap.map((cell, index) => {
						return <div key={index} className='cell'>{cell ? 'x' : ''}</div>
					})
				}
			</div>

			<div>
				<button onClick={() => createNewGame()}>New Game</button>
			</div>
		</div>
	</div>)
}

export default App
