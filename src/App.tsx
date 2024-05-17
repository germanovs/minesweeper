import { useState, useEffect } from 'react'
import './App.scss'

function App() {


	const [minesCount, setMinesCount] = useState<number>(10);
	const [gameMap, setGameMap] = useState<boolean[]>([]);
	const [grid, setGrid] = useState<boolean[][]>([]);
	const [displayGrid, setDisplayGrid] = useState<cellState[][]>([]);

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

		const grid = [];
		for (let i = 0; i < 10; i++) {
			grid.push(gameMap.slice(i * 10, i * 10 + 10));
		}
		setGrid(grid);

		const displayGrid = new Array(10).fill(new Array(10).fill('closed'));
		setDisplayGrid(displayGrid);
	}

	const openCell = (rowIndex: number, cellIndex: number): void => {
		const cellState = displayGrid[rowIndex][cellIndex];
		if (cellState !== 'closed') {
			return;
		}

		const newDisplayGrid = JSON.parse(JSON.stringify(displayGrid));
		newDisplayGrid[rowIndex][cellIndex] = grid[rowIndex][cellIndex] ? '!' : 0;
		console.log(newDisplayGrid);
		
		setDisplayGrid(newDisplayGrid);
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
					displayGrid.map((row, rowIndex) => {
						return row.map((cell, cellIndex) => {
							return (
								<div 
									key={rowIndex + '-' + cellIndex}
									className='cell'
									style={{ backgroundColor: grid[rowIndex][cellIndex] ? '#ffe8c1' : 'inherit' }}
									onClick={() => openCell(rowIndex, cellIndex)}>
									{
										cell === 'closed'
											? ''
											: cell === 'mine' 
												? '!' 
												: cell
									}
								</div>
							)
						})
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
