// The types of actions that you can dispatch to modify the state of the store
export const types = {
      CHANGE: 'CHANGE',
      ratedCount:'ratedCount'
}
// Helper functions to dispatch actions, optionally with payloads
export const actionCreators = {
      change: (value) => {
          return {type: types.CHANGE, payload: value}
      },
      ratedCount:(value)=> {
          return {type: types.ratedCount, payload: value}
      }
}

// Initial state of the store
const initialState = {
      dropVal: 'All Movies',
      ratedVal:0
}

export const reducer = (state = initialState, action) => {
      const {dropVal} = state
      const {ratedVal} =state
      const {type, payload} = action
      switch (type) {
          case types.CHANGE: {
              return {
                  ...state,
                  dropVal:payload,
              }
          }
          case types.ratedCount: {
              return {
                ...state,
                ratedVal:payload,
              }
          }
      }
      return state
}