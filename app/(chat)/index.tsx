import AppButton from '@/components/AppButton'
import AppText from '@/components/AppText'
import { appwriteConfig, db } from '@/utils/appwrite'
import { colors } from '@/utils/colors'
import { ChatRoom } from '@/utils/types'
import { useAuth } from '@clerk/clerk-expo'
import Entypo from '@expo/vector-icons/Entypo'
import { Link } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Animated, FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { Query } from 'react-native-appwrite'
import { SafeAreaView } from 'react-native-safe-area-context'

const LIMIT = 10

// ─── Skeleton Item ────────────────────────────────────────────────────────────
const SkeletonItem = () => {
    const shimmer = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
                Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
            ])
        ).start()
    }, [])

    const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] })

    return (
        <Animated.View style={[styles.roomContainer, { opacity }]}>
            <View style={{ gap: 8 }}>
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonDesc} />
            </View>
            <View style={styles.skeletonChevron} />
        </Animated.View>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const index = () => {
    const { signOut } = useAuth()

    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
    const [initialLoading, setInitialLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    // Keep ALL pagination state in refs — never in useState.
    // This means fetchChatRooms never needs to be inside useCallback,
    // so the function reference stays stable and isFetchingRef always works.
    const pageRef = useRef(0)
    const hasMoreRef = useRef(true)   // ← was useState(hasMore): caused useCallback to recreate
    const isFetchingRef = useRef(false)

    // ── Core fetch ────────────────────────────────────────────────────────────
    const fetchChatRooms = async (reset = false) => {
        if (isFetchingRef.current) return
        if (!reset && !hasMoreRef.current) return   // ← reads ref, never stale

        isFetchingRef.current = true

        try {
            const { documents } = await db.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.chatRooms,
                [Query.limit(LIMIT), Query.offset(reset ? 0 : pageRef.current * LIMIT)]
            )

            const fetched = documents as ChatRoom[]
            hasMoreRef.current = fetched.length === LIMIT   // ← update ref, not state

            if (reset) {
                setChatRooms(fetched)               // replace on reset
                pageRef.current = 1
            } else {
                setChatRooms(prev => [...prev, ...fetched])
                pageRef.current += 1
            }
        } catch (err) {
            console.log('fetchChatRooms error:', err)
        } finally {
            isFetchingRef.current = false
        }
    }

    // ── Handlers ──────────────────────────────────────────────────────────────
    useEffect(() => {
        fetchChatRooms(true).finally(() => setInitialLoading(false))
    }, [])

    const handleRefresh = async () => {
        setRefreshing(true)
        hasMoreRef.current = true
        await fetchChatRooms(true)
        setRefreshing(false)
    }

    const handleLoadMore = async () => {
        if (!hasMoreRef.current || loadingMore || initialLoading || refreshing) return
        setLoadingMore(true)
        await fetchChatRooms(false)
        setLoadingMore(false)
    }

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }} edges={['bottom', 'left', 'right']}>
            <View style={{ flex: 1 }}>
                {initialLoading ? (
                    <View style={{ gap: 10, marginTop: 10 }}>
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)}
                    </View>
                ) : (
                    <FlatList
                        data={chatRooms}
                        keyExtractor={(item) => String(item.$id)}
                        contentContainerStyle={{ gap: 12 }}
                        showsVerticalScrollIndicator={false}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                        ListFooterComponent={loadingMore ? <ActivityIndicator size="large" style={{ marginVertical: 16 }} /> : null}
                        renderItem={({ item }) => (
                            <Link style={{ color: '#FFF' }} href={{ pathname: `/[chat]`, params: { id: item.$id, title: item.title } }}>
                                <View style={styles.roomContainer}>
                                    <ItemTitleAndDesc title={item.title} description={item.description} />
                                    <AppText>
                                        <Entypo name="chevron-small-right" size={32} color={colors.gray} />
                                    </AppText>
                                </View>
                            </Link>
                        )}
                    />
                )}
            </View>

            <View style={{ padding: 12 }}>
                <AppButton title='Sign Out' textStyle={{ color: colors.white }} onPress={() => signOut()} />
            </View>
        </SafeAreaView>
    )
}

export default index

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    roomContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 20,
        backgroundColor: colors.dark,
        width: '100%',
        borderRadius: 18,
    },
    skeletonTitle: { width: 140, height: 16, backgroundColor: colors.gray, borderRadius: 6 },
    skeletonDesc: { width: 200, height: 13, backgroundColor: colors.gray, borderRadius: 6, opacity: 0.5 },
    skeletonChevron: { width: 32, height: 32, backgroundColor: colors.gray, borderRadius: 8, opacity: 0.4 },
})

// ─── Sub-component ────────────────────────────────────────────────────────────
const ItemTitleAndDesc = ({ title, description }: { title: string; description: string }) => (
    <View style={{ gap: 8 }}>
        <AppText style={{ color: colors.white, fontWeight: '600', fontSize: 16 }}>{title}</AppText>
        <AppText style={{ color: colors.gray, fontWeight: '600', fontSize: 14 }}>{description.slice(0, 30)}...</AppText>
    </View>
)