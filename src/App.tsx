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

	const findMinesAround = (row: number, col: number, grid: boolean[][]) => {
		const map = [
			grid[row - 1] === undefined || grid[row - 1][col - 1] === undefined ? false : grid[row - 1][col - 1],
			grid[row - 1] === undefined ? false : grid[row - 1][col],
			grid[row - 1] === undefined || grid[row - 1][col + 1] === undefined ? false : grid[row - 1][col + 1],
			grid[row][col - 1] === undefined ? false : grid[row][col - 1],
			grid[row][col + 1] === undefined ? false : grid[row][col + 1],
			grid[row + 1] === undefined || grid[row + 1][col - 1] === undefined ? false : grid[row + 1][col - 1],
			grid[row + 1] === undefined ? false : grid[row + 1][col],
			grid[row + 1] === undefined || grid[row + 1][col + 1] === undefined ? false : grid[row + 1][col + 1],
		];
		return map.filter(elem => elem).length;
	}

	const defineCellNumber = (rowIndex: number, cellIndex: number) => {
		const minesCount = findMinesAround(rowIndex, cellIndex, grid);
		setDisplayGrid(prev => {
			const newDisplayGrid = JSON.parse(JSON.stringify(prev));
			newDisplayGrid[rowIndex][cellIndex] = minesCount;
			return newDisplayGrid;
		});
	}

	const openCell = (rowIndex: number, cellIndex: number): void => {
		const cellState = displayGrid[rowIndex][cellIndex];
		if (cellState !== 'closed') {
			return;
		}

		const newDisplayGrid = JSON.parse(JSON.stringify(displayGrid));

		if (grid[rowIndex][cellIndex]) {
			newDisplayGrid[rowIndex][cellIndex] = 'mine';
			setDisplayGrid(newDisplayGrid);
			window.alert('You lost');
			return;
		}

		defineCellNumber(rowIndex, cellIndex);
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
