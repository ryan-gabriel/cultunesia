"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Star, TrendingUp, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Leaderboard = ({ data }) => {
  const leaderboard = (data || []).slice(0, 10);
  const [mounted, setMounted] = useState(false);

  // Pisahkan pengguna podium (1-3) dan sisanya untuk mempermudah logika
  const podiumUsers = leaderboard.slice(0, 3);
  const otherUsers = leaderboard.slice(3);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getRankDetails = (index) => {
    // ... (Fungsi ini tidak perlu diubah, biarkan seperti semula)
    switch (index) {
        case 0: return { icon: Crown, gradient: "from-yellow-400 via-amber-500 to-yellow-600", shadow: "shadow-amber-500/30", borderColor: "border-amber-400/40", bgGlow: "bg-amber-500/10", textColor: "text-amber-600 dark:text-amber-400", iconColor: "text-amber-500" };
        case 1: return { icon: Medal, gradient: "from-gray-300 via-gray-400 to-gray-500", shadow: "shadow-gray-400/30", borderColor: "border-gray-400/40", bgGlow: "bg-gray-400/10", textColor: "text-gray-600 dark:text-gray-400", iconColor: "text-gray-500" };
        case 2: return { icon: Award, gradient: "from-orange-400 via-orange-500 to-orange-600", shadow: "shadow-orange-500/30", borderColor: "border-orange-400/40", bgGlow: "bg-orange-500/10", textColor: "text-orange-600 dark:text-orange-400", iconColor: "text-orange-500" };
        default: return { icon: Star, gradient: "from-gray-200 via-gray-300 to-gray-400", shadow: "shadow-gray-300/20", borderColor: "border-gray-300/40", bgGlow: "bg-gray-200/10", textColor: "text-gray-600 dark:text-gray-400", iconColor: "text-gray-400" };
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={mounted ? { opacity: 0, y: -20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl blur-xl opacity-30" />
          <Trophy className="w-16 h-16 text-amber-500 relative z-10 mx-auto" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
          Papan Peringkat
        </h1>
        <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-500" />
          Pemain terbaik berdasarkan total skor
        </p>
      </motion.div>

      {/* Top 3 Podium - Diubah agar fleksibel */}
      {podiumUsers.length > 0 && (
        <motion.div
          // Gunakan flexbox untuk layout yang fleksibel dan items-end untuk efek podium
          className="flex justify-center items-end gap-4 mb-8"
          initial={mounted ? { opacity: 0, scale: 0.9 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* 2nd Place - Tampilkan HANYA jika pengguna di posisi tersebut ada */}
          {podiumUsers[1] && (
            <motion.div
              className="flex flex-col items-center w-1/3"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
               {/* Podium Block (Base) */}
               <Card className="w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-gray-300/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="relative inline-block mb-3">
                      <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-lg" />
                      <Avatar className="w-16 h-16 border-4 border-gray-400/40 relative z-10">
                        <AvatarImage src={podiumUsers[1]?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-gray-300 to-gray-500 text-white font-bold">
                          {getInitials(podiumUsers[1]?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg z-20">
                        <Medal className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-sm mb-1 text-gray-900 dark:text-white truncate">
                      {podiumUsers[1]?.full_name}
                    </h3>
                    <Badge variant="secondary" className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900 border-0">
                      {podiumUsers[1]?.total_score} pts
                    </Badge>
                  </CardContent>
                </Card>
              <div className="w-full h-16 bg-gradient-to-t from-gray-300 to-gray-400 mt-2 rounded-t-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                2
              </div>
            </motion.div>
          )}

          {/* 1st Place - Tampilkan HANYA jika pengguna di posisi tersebut ada */}
          {podiumUsers[0] && (
            <motion.div
              className="flex flex-col items-center w-1/3"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
               <Card className="w-full bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-400/50 dark:border-amber-600/50 shadow-xl hover:shadow-2xl transition-all duration-300 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-lg pointer-events-none" />
                  <CardContent className="p-4 text-center relative z-10">
                    <div className="relative inline-block mb-3">
                      <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl" />
                      <Avatar className="w-20 h-20 border-4 border-amber-400/60 relative z-10">
                        <AvatarImage src={podiumUsers[0]?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-400 to-yellow-600 text-white font-bold text-lg">
                          {getInitials(podiumUsers[0]?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-3 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl z-20 animate-pulse">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-base mb-1 text-gray-900 dark:text-white truncate">
                      {podiumUsers[0]?.full_name}
                    </h3>
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 shadow-lg">
                      {podiumUsers[0]?.total_score} pts
                    </Badge>
                  </CardContent>
                </Card>
              <div className="w-full h-24 bg-gradient-to-t from-amber-500 to-yellow-500 mt-2 rounded-t-lg flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                1
              </div>
            </motion.div>
          )}

          {/* 3rd Place - Tampilkan HANYA jika pengguna di posisi tersebut ada */}
          {podiumUsers[2] && (
            <motion.div
              className="flex flex-col items-center w-1/3"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="w-full bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-gray-800 border-orange-400/50 dark:border-orange-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="relative inline-block mb-3">
                      <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-lg" />
                      <Avatar className="w-16 h-16 border-4 border-orange-400/40 relative z-10">
                        <AvatarImage src={podiumUsers[2]?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold">
                          {getInitials(podiumUsers[2]?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg z-20">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-sm mb-1 text-gray-900 dark:text-white truncate">
                      {podiumUsers[2]?.full_name}
                    </h3>
                    <Badge variant="secondary" className="bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0">
                      {podiumUsers[2]?.total_score} pts
                    </Badge>
                  </CardContent>
                </Card>
              <div className="w-full h-12 bg-gradient-to-t from-orange-400 to-orange-500 mt-2 rounded-t-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Rest of the leaderboard - Gunakan `otherUsers` yang sudah dipisahkan */}
      <motion.div
        className="space-y-3"
        // ... (sisa kode animasi tidak berubah)
      >
        {otherUsers.map((user, index) => {
          const actualIndex = index + 3;
          const rankDetails = getRankDetails(actualIndex);
          const RankIcon = rankDetails.icon;

          return (
             <motion.div
              key={user.user_id}
              // ... (sisa kode list item tidak berubah)
             >
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${rankDetails.gradient} ${rankDetails.shadow} shadow-lg`}>
                        <span className="text-white font-bold text-lg">
                          {actualIndex + 1}
                        </span>
                      </div>
                      <Avatar className="w-12 h-12 border-2 border-gray-200 dark:border-gray-700">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {user.full_name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {user.total_score} poin
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg ${rankDetails.bgGlow}`}>
                        <RankIcon className={`w-5 h-5 ${rankDetails.iconColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {leaderboard.length === 0 && (
        <motion.div
          className="text-center py-12"
          // ... (sisa kode empty state tidak berubah)
        >
          <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Belum Ada Data
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Jadilah yang pertama masuk ke papan peringkat!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard;