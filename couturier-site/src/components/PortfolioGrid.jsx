import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableCard({ photo, categories, onEdit, onArchive, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group cursor-grab active:cursor-grabbing ${
        isDragging ? 'ring-2 ring-amber-500 opacity-75' : ''
      }`}
    >
      {/* IMAGE */}
      <div className="h-56 bg-slate-100 overflow-hidden relative"
      {...attributes}
    {...listeners}>
        <img
          src={photo.image_url}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          draggable="false"
        />
        {isDragging && (
          <div className="absolute inset-0 bg-amber-500 opacity-30 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">⋮⋮</span>
          </div>
        )}
      </div>

      {/* DESCRIPTIF + BUTTONS */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100 border border-amber-200/60 px-2 py-0.5 rounded">
            {categories.find((c) => c.id == photo.category_id)?.name || 'SANS CATÉGORIE'}
          </span>
          <h4 className="font-serif font-bold text-slate-900 text-base mt-2 truncate">
            {photo.title}
          </h4>
        </div>

        {/* BOUTONS - pointerEvents: 'auto' pour que les clics passent */}
        <div 
          className="flex gap-2 mt-5 pt-3 border-t border-slate-100"
          style={{ pointerEvents: 'auto' }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(photo);
            }}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1.5 rounded text-xs transition"
          >
            Modifier
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive(photo.id);
            }}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1.5 rounded text-xs transition"
          >
            Archiver
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(photo.id);
            }}
            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/60 font-semibold px-3 py-1.5 rounded text-xs transition"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioGrid({ photos, categories, onEdit, onArchive, onDelete, onReorder }) {
  const [items, setItems] = useState(photos);
  const [isReordering, setIsReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    setIsReordering(true);
    try {
      const token = localStorage.getItem('adminToken');
      const reorderedData = newItems.map((item, index) => ({
        id: item.id,
        position: index,
      }));

      const res = await fetch('https://atelier-couture-3954.onrender.com/api/portfolio/reorder', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: reorderedData }),
      });

      if (res.ok) {
        console.log('✅ Ordre mis à jour');
        if (onReorder) onReorder(newItems);
      } else {
        const error = await res.json();
        console.error('Erreur:', error);
        setItems(photos);
        alert('Erreur lors de la réorganisation: ' + error.error);
      }
    } catch (err) {
      console.error('Erreur reorder:', err);
      setItems(photos);
    } finally {
      setIsReordering(false);
    }
  };

  const itemIds = items.map((item) => item.id);

  return (
    <div>
      {isReordering && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg">
          ⏳ Mise à jour de l'ordre...
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((photo) => (
              <SortableCard
                key={photo.id}
                photo={photo}
                categories={categories}
                onEdit={onEdit}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}