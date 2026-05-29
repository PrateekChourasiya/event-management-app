import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './authSlice'; // re-use the configured axios instance

export const getAllEvents = createAsyncThunk('event/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/event/allEvents');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
  }
});

export const getEventsByUser = createAsyncThunk('event/getByUser', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('event/eventsByUser');
    console.log(response.data.data.events);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user events');
  }
});

export const getEventById = createAsyncThunk('event/getById', async (eid, { rejectWithValue }) => {
  try {
    const response = await api.get(`event/eventById/${eid}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
  }
});

export const createEvent = createAsyncThunk('event/create', async (eventData, { rejectWithValue }) => {
  try {
    const response = await api.post('event/create', eventData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create event');
  }
});

export const updateEvent = createAsyncThunk('event/update', async ({ eid, data }, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const isAdmin = auth.user?.role === 'admin';
    const endpoint = isAdmin ? `event/admin/update/${eid}` : `event/update/${eid}`;
    
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update event');
  }
});

export const deleteEvent = createAsyncThunk('event/delete', async (eid, { rejectWithValue }) => {
  try {
    const response = await api.delete(`event/delete/${eid}`);
    return eid; // return the id to remove it from state
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
  }
});

const initialState = {
  events: [],
  userEvents: [],
  currentEvent: null,
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getAllEvents
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.data.events;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getEventsByUser
      .addCase(getEventsByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEventsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userEvents = action.payload.data.events;
      })
      .addCase(getEventsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getEventById
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload.data.event;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createEvent
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload.data.event);
        state.userEvents.push(action.payload.data.event);
      })
      // updateEvent
      .addCase(updateEvent.fulfilled, (state, action) => {
        const updated = action.payload.data.event;
        const index = state.events.findIndex(e => e._id === updated.eventId);
        if(index !== -1) state.events[index] = updated;
        
        const userIndex = state.userEvents.findIndex(e => e._id === updated.eventId);
        if(userIndex !== -1) state.userEvents[userIndex] = updated;

        if (state.currentEvent?._id === updated.eventId) {
          state.currentEvent = updated;
        }
      })
      // deleteEvent
      .addCase(deleteEvent.fulfilled, (state, action) => {
        const eid = action.payload;
        state.events = state.events.filter(e => e._id !== eid);
        state.userEvents = state.userEvents.filter(e => e._id !== eid);
      });
  }
});

export const { clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;
