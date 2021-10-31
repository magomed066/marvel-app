import './charList.scss'
import { useEffect, useState, useRef } from 'react'
import useMarvelService from '../../services/MarvelService'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../error/ErrorMessage'
import PropTypes from 'prop-types'

const CharList = ({ onCharSelected }) => {
	const [list, setList] = useState([])
	const [newItemsLoading, setNewItemsLoading] = useState(false)
	const [offset, setOffset] = useState(210)
	const [charEnded, setCharEnded] = useState(false)

	const { loading, error, getAllCharacters } = useMarvelService()

	useEffect(() => {
		onRequest(offset, true)
	}, [])

	const onRequest = (offset, initial) => {
		initial ? setNewItemsLoading(false) : setNewItemsLoading(true)
		getAllCharacters(offset).then(onCharactersLoaded)
	}

	const onCharactersLoaded = (chars) => {
		let ended = false
		if (chars.length < 9) {
			ended = true
		}

		setList((prev) => [...prev, ...chars])
		setOffset((prev) => prev + 9)
		setNewItemsLoading(false)
		setCharEnded(ended)
	}

	const itemRefs = useRef([])

	function focusOnItem(id) {
		itemRefs.current.forEach((item) =>
			item.classList.remove('char__item_selected'),
		)

		itemRefs.current[id].classList.add('char__item_selected')
		itemRefs.current[id].focus()
	}

	const renderItems = (data) => {
		const items = data.map((item, i) => {
			let imgStyle = { objectFit: 'cover' }
			if (
				item.thumbnail ===
				'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
			) {
				imgStyle = { objectFit: 'unset' }
			}

			return (
				<li
					ref={(el) => (itemRefs.current[i] = el)}
					className="char__item"
					key={item.id}
					onClick={() => {
						onCharSelected(item.id)
						focusOnItem(i)
					}}
					onKeyPress={(e) => {
						if (e.key === '' || e.key === 'Enter') {
							onCharSelected(item.id)
							focusOnItem(i)
						}
					}}
				>
					<img src={item.thumbnail} alt={item.name} style={imgStyle} />
					<div className="char__name">{item.name}</div>
				</li>
			)
		})

		return <ul className="char__grid">{items}</ul>
	}

	const items = renderItems(list)

	const errorMessage = error ? <ErrorMessage /> : null
	const spinner = loading ? <Spinner /> : null

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			{items}
			<button
				onClick={() => onRequest(offset)}
				disabled={newItemsLoading}
				style={{ display: charEnded ? 'none' : 'block' }}
				className="button button__main button__long"
			>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired,
}

export default CharList
