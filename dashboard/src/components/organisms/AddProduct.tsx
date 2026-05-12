"use client";

import { useState, useContext } from "react";
import { Card, Title, Stack, TextInput, Group, Button, FileButton, Avatar, Text } from "@mantine/core";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { HiPlus } from "react-icons/hi2";

export default function AddProduct({ onCreated }: { onCreated: () => void }) {
  const { productRepository, fileRepository } = useContext(RepositoriesContext);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setCoverFile(file);
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverPreview(null);
    }
  };

  const handleCreate = async () => {
    if (!productRepository || !fileRepository || !slug || !name) return;
    setLoading(true);
    try {
      let coverFileId = 0;
      if (coverFile) {
        coverFileId = await fileRepository.upload(coverFile, "product-covers");
      }

      await productRepository.create({
        slug,
        names: { en: name },
        descriptions: { en: description },
        cover_file_id: coverFileId,
        badges: []
      });

      // Reset
      setSlug("");
      setName("");
      setDescription("");
      setCoverFile(null);
      setCoverPreview(null);
      onCreated();
    } catch (err) {
      console.error("Failed to create product", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card p="xl" radius={32} shadow="sm" mt="xl">
      <Title order={3} size="h4" fw={500} mb="lg">
        Create New Product
      </Title>
      
      <Group align="flex-start" gap="xl">
        <Stack align="center" gap="xs">
          <Avatar src={coverPreview} size={120} radius={24} style={{ border: '1px solid #f1f5f9' }}>
            NA
          </Avatar>
          <FileButton onChange={handleFileChange} accept="image/png,image/jpeg">
            {(props) => (
              <Button {...props} variant="light" size="xs" radius="xl">
                Choose Cover
              </Button>
            )}
          </FileButton>
        </Stack>

        <Stack style={{ flex: 1 }} gap="md">
          <Group grow>
            <TextInput 
              label="Product Name (English)" 
              placeholder="e.g. Fresh Orange Juice" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              radius="md"
            />
            <TextInput 
              label="Slug" 
              placeholder="e.g. orange-juice" 
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              radius="md"
            />
          </Group>
          <TextInput 
            label="Description (English)" 
            placeholder="Brief description of the product" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            radius="md"
          />
          <Group justify="flex-end" mt="sm">
            <Button 
              onClick={handleCreate} 
              loading={loading} 
              leftSection={<HiPlus size={16} />}
              radius="xl"
              disabled={!slug || !name}
            >
              Create Product
            </Button>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}
