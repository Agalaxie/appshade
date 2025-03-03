import { useState, useEffect } from 'react';
import { tickets, clients, messages, users } from './data';
import { Ticket, Client, Message, User } from '@/types';

export function useTickets() {
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un appel API
    setTimeout(() => {
      setData(tickets);
      setLoading(false);
    }, 500);
  }, []);

  return { data, loading };
}

export function useClients() {
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un appel API
    setTimeout(() => {
      setData(clients);
      setLoading(false);
    }, 500);
  }, []);

  return { data, loading };
}

export function useMessages() {
  const [data, setData] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un appel API
    setTimeout(() => {
      setData(messages);
      setLoading(false);
    }, 500);
  }, []);

  return { data, loading };
}

export function useUsers() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un appel API
    setTimeout(() => {
      setData(users);
      setLoading(false);
    }, 500);
  }, []);

  return { data, loading };
} 