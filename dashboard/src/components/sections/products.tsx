"use client";

import { Badge, Card, Table, Title, Text, Group, ScrollArea, Center, Stack, Loader, Avatar, FileButton, Button } from "@mantine/core";
import { serviceProductToProduct } from "@/utils/product_utils";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import { Product } from "@/types/product";
import Link from "next/link";
import AddProduct from "../organisms/AddProduct";

export default function ProductsSection() {
  const { productRepository, fileRepository } = useContext(RepositoriesContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingProductId, setUploadingProductId] = useState<number | null>(null);

  const loadProducts = () => {
    if (!productRepository) return;
    setLoading(true);
    productRepository.getAll()
      .then(serviceProducts => {
        const mappedProducts = serviceProducts.map(serviceProductToProduct);
        setProducts(mappedProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load products", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, [productRepository]);

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader size="lg" variant="dots" />
          <Text size="sm" c="dimmed" fw={300}>Loading products...</Text>
        </Stack>
      </Center>
    );
  }

  const handleUploadCover = async (product: Product, file: File | null) => {
    if (!file || !fileRepository || !productRepository) return;
    setUploadingProductId(product.id);
    try {
      const fileId = await fileRepository.upload(file, "product-covers");
      await productRepository.update({ id: product.id, cover_file_id: fileId });
      loadProducts();
    } catch (err) {
      console.error("Failed to upload cover", err);
    } finally {
      setUploadingProductId(null);
    }
  };

  const rows = products.map((product) => {
    const getTranslation = (data: Map<string, string>, lang: string = "en") => {
      return data.get(lang) || Array.from(data.values())[0] || "Unknown";
    };

    const name = getTranslation(product.names);

    const coverElement = (
      <Stack align="center" gap={4}>
        <Avatar
          src={product.cover?.url}
          alt={String(name)}
          radius="md"
          size="md"
          style={{ border: '1px solid #f1f5f9' }}
        >
          NA
        </Avatar>
        <FileButton onChange={(file) => handleUploadCover(product, file)} accept="image/png,image/jpeg">
          {(props) => (
            <Button {...props} variant="subtle" size="compact-xs" loading={uploadingProductId === product.id}>
              Upload Cover
            </Button>
          )}
        </FileButton>
      </Stack>
    );

    const badgesElement = product.badges.length > 0 ? (
      <Group gap={4} justify="center">
        {product.badges.map((badge, i) => (
          <Badge key={i} color="gray" variant="light" size="xs" radius="sm">{badge}</Badge>
        ))}
      </Group>
    ) : (
      <Text size="xs" c="dimmed" fs="italic" ta="center">None</Text>
    );

    const statusElement = product.enabled ? (
      <Badge color="green" variant="light" radius="sm">ENABLED</Badge>
    ) : (
      <Badge color="red" variant="light" radius="sm">DISABLED</Badge>
    );

    return (
      <Table.Tr 
        key={product.id} 
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          // Navigation logic is handled by Link wrappers in Tds
          // but we can add an extra layer if needed.
        }}
      >
        <Table.Td align="center">
          <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <Text size="xs" ff="monospace" fw={300} style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'inline-block' }}>
              {product.id}
            </Text>
          </Link>
        </Table.Td>
        <Table.Td>
          <Center>{coverElement}</Center>
        </Table.Td>
        <Table.Td>
          <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <Text size="sm" fw={400} c="slate.8">
              {String(name)}
            </Text>
          </Link>
        </Table.Td>
        <Table.Td align="center">
          <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            {badgesElement}
          </Link>
        </Table.Td>
        <Table.Td align="center">
          <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            {statusElement}
          </Link>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Stack gap="xl">
      <Card p="xl" radius={32} shadow="sm">
        <Group mb="xl" gap="xs">
          <Title order={3} size="h4" fw={500}>
            Products
          </Title>
          <Badge color="blue" variant="light" radius="xl" size="xs">
            {products.length}
          </Badge>
        </Group>

        <ScrollArea>
          <Table verticalSpacing="md" striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ textAlign: 'center' }}>ID</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Cover</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Badges</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

      <AddProduct onCreated={loadProducts} />
    </Stack>
  );
}
