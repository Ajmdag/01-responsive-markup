import {} from './modules/videos-observation/initVideo'
import {} from './modules/videos-observation/workWithVideos'

import Store from 'flux-framework'

const brightnessInputGlobal = document.querySelector('.videos-wrap__brightness-input')
const contrastInputGlobal = document.querySelector('.videos-wrap__contrast-input')

const contrastInputValueDisplay = document.querySelector('.videos-wrap__contrast-value-display')
const brightnessInputValueDisplay = document.querySelector('.videos-wrap__brightness-value-display')

const reducer = (state, action) => {
	if (action.type === 'CHANGE') {
		return action.data
	}
	return state
}

const initialState = {
	value: 20
}

const store = new Store(reducer, initialState)

brightnessInputGlobal.addEventListener('input', () => {
	const incrementState = { type: 'CHANGE', data: brightnessInputGlobal.value }
	store.update(incrementState)
	brightnessInputValueDisplay.innerHTML = store.getState
})

contrastInputGlobal.addEventListener('input', () => {
	const incrementState = { type: 'CHANGE', data: contrastInputGlobal.value }
	store.update(incrementState)
	contrastInputValueDisplay.innerHTML = store.getState
})

const incrementState = { type: 'CHANGE', data: 3 }

store.update(incrementState)
