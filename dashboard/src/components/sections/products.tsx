"use client";

import { Badge, Card, Table, Title, Text, Group, ScrollArea, Center, Stack, Loader, Avatar, Box } from "@mantine/core";
import { serviceProductToProduct } from "@/utils/product_utils";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import { Product } from "@/types/product";

export default function ProductsSection() {
  const { productRepository } = useContext(RepositoriesContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productRepository) {
      return;
    }

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
  }, [productRepository]);

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader size="lg" variant="dots" />
          <Text size="sm" c="dimmed" fw={500}>Loading products...</Text>
        </Stack>
      </Center>
    );
  }

  const rows = products.map((product) => {
    const getTranslation = (data: any, lang: string = "en") => {
      if (data instanceof Map) {
        return data.get(lang) || Array.from(data.values())[0] || "Unknown";
      }
      return data[lang] || Object.values(data)[0] || "Unknown";
    };

    const name = getTranslation(product.names);
    
    const coverElement = (
      <Avatar
        src={product.cover?.url}
        alt={String(name)}
        radius="md"
        size="md"
        style={{ border: '1px solid #f1f5f9' }}
      >
        NA
      </Avatar>
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
      <Table.Tr key={product.id}>
        <Table.Td align="center">
          <Text size="xs" ff="monospace" fw={600} style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'inline-block' }}>
            {product.id}
          </Text>
        </Table.Td>
        <Table.Td>
          <Center>{coverElement}</Center>
        </Table.Td>
        <Table.Td>
          <Text size="sm" fw={700} c="slate.8">
            {String(name)}
          </Text>
        </Table.Td>
        <Table.Td align="center">{badgesElement}</Table.Td>
        <Table.Td align="center">{statusElement}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card p="xl" radius={32} shadow="sm">
      <Group mb="xl" gap="xs">
        <Title order={3} size="h4" fw={700}>
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
  );
}
