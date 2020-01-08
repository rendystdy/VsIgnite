/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put, all, take, select } from 'redux-saga/effects'
import PubnubActions, { PubnubTypes } from '../../Redux/PubnubRedux'
import PubnubManager from '../../Pubnub/PubnubManager'
import PubnubStrings from '../../Pubnub/PubnubStrings'
import NavigationServices from '../../Services/NavigationServices'
import { StackActions } from 'react-navigation'
import { PubnubSelectors } from '../../Redux/PubnubRedux'
import { PubnubStoreSelectors } from '../../Redux/PubnubStoreRedux'
import { generateSingleSpaceUID, generateGroupSpaceUID } from '../../Pubnub/PubnubHelper'
import PubnubStoreActions from '../../Redux/PubnubStoreRedux'

export function* craeteSpace(spaceId, name, description, newCustom, users) {
  const response = yield PubnubManager.createSpace(spaceId, name, description, newCustom)

  const space = response.data

  yield all([
    put(PubnubStoreActions.saveSpaces([space])),
    put(PubnubActions.addPubnubSpaceMemberRequest({ spaceId, users })),
    put(PubnubActions.createPubnubSpaceSuccess(response.data)),
  ])

  yield take(PubnubTypes.ADD_PUBNUB_SPACE_MEMBER_SUCCESS)

  const replaceAction = StackActions.replace({
    routeName: 'ChatScreen',
    params: {
      data: response.data
    }
  });
  NavigationServices.dispatch(replaceAction)
}

export function* createPubnubSpace(action) {
  try {
    const { name, description, custom, users, type } = action.data
    const spaceId = type === PubnubStrings.space.type.single ? generateSingleSpaceUID() : generateGroupSpaceUID()
    let newCustom = {}
    if (custom) newCustom = { ...custom }

    if (type === PubnubStrings.space.type.single) {
      const currentUser = PubnubManager.getCurrentUser()
      newCustom = {
        ...newCustom,
        [currentUser.id]: JSON.stringify(currentUser),
        [users[0].id]: JSON.stringify(users[0])
      }

      const space = yield select(PubnubStoreSelectors.getSingleSpaceByUserId, users[0].id)
      if (space) {
        const replaceAction = StackActions.replace({
          routeName: 'ChatScreen',
          params: {
            data: space
          }
        });
        NavigationServices.dispatch(replaceAction)
      } else {
        yield* craeteSpace(spaceId, name, description, newCustom, users)
      }
    } else {
      yield* craeteSpace(spaceId, name, description, newCustom, users)
    }

  } catch (error) {
    yield put(PubnubActions.createPubnubSpaceFailure())
  }
}

export function* getPubnubSpace(action) {
  try {
    const { uid } = action.data
    const response = yield PubnubManager.getSpace(uid)
    yield put(PubnubActions.getPubnubSpaceSuccess(response))
  } catch (error) {
    yield put(PubnubActions.getPubnubSpaceFailure())
  }
}

export function* getAllPubnubSpace(action) {
  try {
    const { limit, page } = action.data
    const response = yield PubnubManager.getAllSpaces(limit, page)
    const spaceIds = response.data.map((s) => s.id)
    // for (let i = 0; i < spaceIds.length; i++) {
    //   yield PubnubManager.deleteSpace(spaceIds[i])
    // }
    yield all([
      put(PubnubStoreActions.saveSpaces(response.data)),
      put(PubnubActions.getAllPubnubSpaceSuccess(response)),
      put(PubnubActions.getPubnubMessageRequest({ channels: spaceIds, limit: 100 }))
    ])
  } catch (error) {
    yield put(PubnubActions.getAllPubnubSpaceFailure())
  }
}

export function* updatePubnubSpace(action) {
  try {
    const { uid, name, description, custom } = action.data
    const response = yield PubnubManager.updateSpace(uid, name, description, custom)
    yield put(PubnubActions.updatePubnubSpaceSucccess(response))
  } catch (error) {
    yield put(PubnubActions.updatePubnubSpaceFailure())
  }
}

export function* deletePubnubSpace(action) {
  try {
    const { uid } = action.data
    const response = yield PubnubManager.deleteSpace(uid)
    yield put(PubnubActions.deletePubnubSpaceSuccess(response))
  } catch (error) {
    yield put(PubnubActions.deletePubnubSpaceFailure())
  }
}

export function* joinPubnubSpace(action) {
  try {
    const { userId, spaces } = action.data
    const response = yield PubnubManager.joinSpace(userId, spaces)
    yield put(PubnubActions.joinPubnubSpaceSuccess(response))
  } catch (error) {
    yield put(PubnubActions.joinPubnubSpaceFailure())
  }
}

export function* leavePubnubSpace(action) {
  try {
    const { userId, spaces } = action.data
    const response = yield PubnubManager.leaveSpace(userId, spaces)
    yield put(PubnubActions.leavePubnubSpaceSuccess(response))
  } catch (error) {
    yield put(PubnubActions.leavePubnubSpaceFailure())
  }
}

export function* getPubnubSpaceMembership(action) {
  try {
    const { userId } = action.data
    const response = yield PubnubManager.getMembership(userId)
    yield put(PubnubActions.getPubnubSpaceMembershipSuccess(response))
  } catch (error) {
    yield put(PubnubActions.getPubnubSpaceMembershipFailure())
  }
}

export function* updatePubnubSpaceMembership(action) {
  try {
    const { userId, spaces } = action.data
    const response = yield PubnubManager.updateMembership(userId, spaces)
    yield put(PubnubActions.updatePubnubSpaceMembershipSuccess(response))
  } catch (error) {
    yield put(PubnubActions.updatePubnubSpaceMembershipFailure())
  }
}

export function* getPubnubSpaceMember(action) {
  try {
    const { spaceId } = action.data
    const response = yield PubnubManager.getMembers(spaceId)
    yield put(PubnubActions.getPubnubSpaceMemberSuccess(response))
  } catch (error) {
    yield put(PubnubActions.getPubnubSpaceMemberFailure())
  }
}

export function* addPubnubSpaceMember(action) {
  try {
    const { spaceId, users } = action.data
    const response = yield PubnubManager.addMembers(spaceId, users)
    yield put(PubnubActions.addPubnubSpaceMemberSuccess(response.data))
  } catch (error) {
    yield put(PubnubActions.addPubnubSpaceMemberFailure())
  }
}

export function* removePubnubSpaceMember(action) {
  try {
    const { spaceId, users } = action.data
    const response = yield PubnubManager.removeMembers(spaceId, users)
    yield put(PubnubActions.removePubnubSpaceMemberSuccess(response))
  } catch (error) {
    yield put(PubnubActions.removePubnubSpaceMemberFailure())
  }
}