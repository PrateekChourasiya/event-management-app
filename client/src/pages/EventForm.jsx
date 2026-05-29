import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent, updateEvent, getEventById, clearCurrentEvent } from '../store/eventSlice';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import toast from 'react-hot-toast';

const countWords = (str) => {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(w => w.length > 0).length;
};

const MAX_TITLE_WORDS = 15;
const MAX_DESC_WORDS = 50;
const MAX_CONTENT_WORDS = 500;

const EventForm = () => {
  const { eid } = useParams();
  const isEditMode = !!eid;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, currentEvent } = useSelector((state) => state.event);

  const eventSchema = React.useMemo(() => {
    return z.object({
      title: z.string()
        .min(3, { message: "Title is required" })
        .refine(val => countWords(val) <= MAX_TITLE_WORDS, { message: `Title must be max ${MAX_TITLE_WORDS} words` }),
      description: z.string()
        .min(10, { message: "Description must be at least 10 chars" })
        .refine(val => countWords(val) <= MAX_DESC_WORDS, { message: `Description must be max ${MAX_DESC_WORDS} words` }),
      content: z.string()
        .min(10, { message: "Content must be at least 10 chars" })
        .refine(val => countWords(val) <= MAX_CONTENT_WORDS, { message: `Content must be max ${MAX_CONTENT_WORDS} words` }),
      category: z.string().min(2, { message: "Category is required" }),
      venue: z.string().min(3, { message: "Venue is required" }),
      startTime: z.string().min(1, { message: "Start time is required" }),
      endTime: z.string().min(1, { message: "End time is required" }),
      price: z.coerce.number().min(0, { message: "Price cannot be negative" }),
      isFree: z.boolean().default(false),
    }).superRefine((data, ctx) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      const now = new Date();

      if (!isEditMode) {
        if (start < now) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Start time cannot be in the past",
            path: ["startTime"]
          });
        }
      }

      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be strictly after start time",
          path: ["endTime"]
        });
      }
    });
  }, [isEditMode]);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      isFree: false,
      price: 0
    }
  });

  const watchIsFree = watch('isFree', false);
  const watchTitle = watch('title', '');
  const watchDescription = watch('description', '');
  const watchContent = watch('content', '');

  // Get current local time for min attribute
  const nowISO = new Date().toISOString().slice(0, 16);

  useEffect(() => {
    if (isEditMode) {
      dispatch(getEventById(eid)).unwrap().then(res => {
        const event = res.data.event;
        reset({
          ...event,
          startTime: new Date(event.startTime).toISOString().slice(0,16),
          endTime: new Date(event.endTime).toISOString().slice(0,16),
        });
      }).catch(() => {
        toast.error("Failed to load event");
        navigate('/profile');
      });
    }
    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [dispatch, eid, isEditMode, reset, navigate]);

  const onSubmit = async (data) => {
    if (data.isFree) data.price = 0;
    
    try {
      let res;
      if (isEditMode) {
        res = await dispatch(updateEvent({ eid, data }));
        if (updateEvent.fulfilled.match(res)) {
          toast.success("Event updated successfully!");
          navigate('/profile');
        } else {
          toast.error(res.payload || "Update failed");
        }
      } else {
        res = await dispatch(createEvent(data));
        if (createEvent.fulfilled.match(res)) {
          toast.success("Event created successfully!");
          navigate('/');
        } else {
          toast.error(res.payload || "Creation failed");
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto bg-white border-2 border-retro-light p-6 md:p-10 shadow-[8px_8px_0px_rgba(33,37,41,1)]">
        <h2 className="text-2xl font-retro text-center mb-8 text-retro-accent">
          {isEditMode ? 'UPDATE EVENT' : 'CREATE NEW EVENT'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <div className="flex justify-between items-end mb-2">
                <label className="block font-bold text-retro-light">EVENT TITLE</label>
                <span className={`text-xs font-bold ${countWords(watchTitle) > MAX_TITLE_WORDS ? 'text-retro-error' : 'text-gray-500'}`}>
                  {countWords(watchTitle)} / {MAX_TITLE_WORDS} WORDS
                </span>
              </div>
              <input type="text" {...register('title')} className="retro-input" placeholder="Awesome Tech Meetup" />
              {errors.title && <p className="text-retro-error text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block font-bold text-retro-light mb-2">CATEGORY</label>
              <input type="text" {...register('category')} className="retro-input" placeholder="Technology" />
              {errors.category && <p className="text-retro-error text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block font-bold text-retro-light mb-2">VENUE / LOCATION</label>
              <input type="text" {...register('venue')} className="retro-input" placeholder="City Hall" />
              {errors.venue && <p className="text-retro-error text-sm mt-1">{errors.venue.message}</p>}
            </div>

            <div>
              <label className="block font-bold text-retro-light mb-2">START TIME</label>
              <input 
                type="datetime-local" 
                {...register('startTime')} 
                min={isEditMode ? undefined : nowISO}
                className="retro-input" 
              />
              {errors.startTime && <p className="text-retro-error text-sm mt-1">{errors.startTime.message}</p>}
            </div>

            <div>
              <label className="block font-bold text-retro-light mb-2">END TIME</label>
              <input 
                type="datetime-local" 
                {...register('endTime')} 
                min={isEditMode ? undefined : nowISO}
                className="retro-input" 
              />
              {errors.endTime && <p className="text-retro-error text-sm mt-1">{errors.endTime.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <div className="flex justify-between items-end mb-2">
                <label className="block font-bold text-retro-light">SHORT DESCRIPTION</label>
                <span className={`text-xs font-bold ${countWords(watchDescription) > MAX_DESC_WORDS ? 'text-retro-error' : 'text-gray-500'}`}>
                  {countWords(watchDescription)} / {MAX_DESC_WORDS} WORDS
                </span>
              </div>
              <textarea {...register('description')} rows={2} className="retro-input resize-none" placeholder="A brief summary..." />
              {errors.description && <p className="text-retro-error text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <div className="flex justify-between items-end mb-2">
                <label className="block font-bold text-retro-light">FULL CONTENT / DETAILS</label>
                <span className={`text-xs font-bold ${countWords(watchContent) > MAX_CONTENT_WORDS ? 'text-retro-error' : 'text-gray-500'}`}>
                  {countWords(watchContent)} / {MAX_CONTENT_WORDS} WORDS
                </span>
              </div>
              <textarea {...register('content')} rows={5} className="retro-input" placeholder="Detailed event schedule, speakers, etc." />
              {errors.content && <p className="text-retro-error text-sm mt-1">{errors.content.message}</p>}
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-retro-brown p-4 border border-retro-light">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('isFree')} className="w-5 h-5 accent-retro-accent cursor-pointer" />
                <span className="font-bold text-retro-light">THIS IS A FREE EVENT</span>
              </label>

              <div className="flex-1 w-full">
                <label className="block font-bold text-retro-light mb-2">PRICE ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  {...register('price')} 
                  disabled={watchIsFree}
                  className="retro-input disabled:opacity-50" 
                  placeholder="0.00" 
                />
                {errors.price && <p className="text-retro-error text-sm mt-1">{errors.price.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t-2 border-retro-light">
            <button type="button" onClick={() => navigate(-1)} className="retro-btn bg-white text-retro-light hover:bg-gray-100 flex-1">
              CANCEL
            </button>
            <button type="submit" disabled={loading} className="retro-btn flex-1">
              {loading ? 'SAVING...' : (isEditMode ? 'UPDATE' : 'CREATE')}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EventForm;
