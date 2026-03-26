"use client";

import { useEffect, useMemo, useState } from "react";

type CrudMessages = {
  load: string;
  save: string;
  delete: string;
};

type UseAdminCrudOptions<Item, Form, Payload> = {
  endpoint: string;
  defaultForm: Form;
  getItems: (data: unknown) => Item[];
  getItemId: (item: Item) => string;
  mapItemToForm: (item: Item) => Form;
  buildPayload: (context: {
    form: Form;
    items: Item[];
    editingId: string | null;
    editingItem: Item | null;
  }) => Payload;
  messages: CrudMessages;
  validate?: (form: Form) => Record<string, string>;
};

export function useAdminCrud<
  Item,
  Form extends Record<string, unknown>,
  Payload = Form,
>({
  endpoint,
  defaultForm,
  getItems,
  getItemId,
  mapItemToForm,
  buildPayload,
  messages,
  validate,
}: UseAdminCrudOptions<Item, Form, Payload>) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(defaultForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const editingItem = useMemo(
    () => items.find((item) => getItemId(item) === editingId) ?? null,
    [editingId, getItemId, items],
  );

  const isEditing = Boolean(editingId);

  const isDirty = useMemo(() => {
    const baseForm = editingItem ? mapItemToForm(editingItem) : defaultForm;
    return JSON.stringify(form) !== JSON.stringify(baseForm);
  }, [defaultForm, editingItem, form, mapItemToForm]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(endpoint, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(messages.load);
      }

      const data = await response.json();
      setItems(getItems(data));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : messages.load);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, [endpoint]);

  const resetForm = () => {
    setEditingId(null);
    setForm(defaultForm);
  };

  const startEdit = (item: Item) => {
    setEditingId(getItemId(item));
    setForm(mapItemToForm(item));
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();

    if (validate) {
      const errors = validate(form);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = buildPayload({
        form,
        items,
        editingId,
        editingItem,
      });

      const response = await fetch(
        editingId ? `${endpoint}/${editingId}` : endpoint,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          typeof data?.message === "string" ? data.message : messages.save,
        );
      }

      await loadItems();
      resetForm();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : messages.save,
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          typeof data?.message === "string" ? data.message : messages.delete,
        );
      }

      await loadItems();
      if (editingId === id) {
        resetForm();
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : messages.delete,
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    items,
    loading,
    saving,
    setSaving,
    error,
    setError,
    editingId,
    editingItem,
    isEditing,
    isDirty,
    form,
    setForm,
    fieldErrors,
    setFieldErrors,
    loadItems,
    resetForm,
    startEdit,
    submitForm,
    deleteItem,
  };
}
