package com.scrolldown.social

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.*
import com.scrolldown.social.ui.theme.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ScrollDownTheme {
                ScrollDownApp()
            }
        }
    }
}

sealed class Screen(val route: String, val title: String, val activeIcon: androidx.compose.ui.graphics.vector.ImageVector, val inactiveIcon: androidx.compose.ui.graphics.vector.ImageVector) {
    object Feed : Screen("feed", "Home", Icons.Filled.Home, Icons.Outlined.Home)
    object Explore : Screen("explore", "Explore", Icons.Filled.Search, Icons.Outlined.Search)
    object Create : Screen("create", "Create", Icons.Filled.AddCircle, Icons.Outlined.AddCircleOutline)
    object Reels : Screen("reels", "Reels", Icons.Filled.PlayCircle, Icons.Outlined.PlayCircleOutline)
    object Profile : Screen("profile", "Profile", Icons.Filled.Person, Icons.Outlined.Person)
    object Chat : Screen("chat", "Direct Messages", Icons.Filled.Send, Icons.Outlined.Send)
    object Notifications : Screen("notifications", "Activity", Icons.Filled.Favorite, Icons.Outlined.FavoriteBorder)
    object Settings : Screen("settings", "Settings", Icons.Filled.Settings, Icons.Outlined.Settings)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScrollDownApp() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: Screen.Feed.route

    val bottomNavItems = listOf(
        Screen.Feed,
        Screen.Explore,
        Screen.Create,
        Screen.Reels,
        Screen.Profile
    )

    Scaffold(
        containerColor = BgObsidian,
        topBar = {
            if (currentRoute !in listOf(Screen.Reels.route)) {
                CenterAlignedTopAppBar(
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                        containerColor = BgObsidian
                    ),
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "SCROLL",
                                fontWeight = FontWeight.Black,
                                fontSize = 20.sp,
                                color = NeonPurple,
                                letterSpacing = 2.sp
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "DOWN",
                                fontWeight = FontWeight.Black,
                                fontSize = 20.sp,
                                color = NeonMagenta,
                                letterSpacing = 2.sp
                            )
                        }
                    },
                    actions = {
                        IconButton(onClick = { navController.navigate(Screen.Notifications.route) }) {
                            Icon(
                                imageVector = Icons.Outlined.FavoriteBorder,
                                contentDescription = "Notifications",
                                tint = TextPrimary
                            )
                        }
                        IconButton(onClick = { navController.navigate(Screen.Chat.route) }) {
                            Icon(
                                imageVector = Icons.Outlined.Send,
                                contentDescription = "Messages",
                                tint = NeonCyan
                            )
                        }
                    }
                )
            }
        },
        bottomBar = {
            NavigationBar(
                containerColor = BgObsidian,
                tonalElevation = 8.dp,
                modifier = Modifier.border(
                    width = 1.dp,
                    color = BorderNeonPurple.copy(alpha = 0.2f)
                )
            ) {
                bottomNavItems.forEach { screen ->
                    val selected = currentRoute == screen.route
                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            if (currentRoute != screen.route) {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.startDestinationId) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        },
                        icon = {
                            Icon(
                                imageVector = if (selected) screen.activeIcon else screen.inactiveIcon,
                                contentDescription = screen.title,
                                tint = if (selected) NeonPurple else TextMuted
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            indicatorColor = BgCard
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Feed.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Feed.route) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("SCROLL DOWN Feed Screen", color = TextPrimary)
                }
            }
            composable(Screen.Explore.route) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Explore & Trending", color = TextPrimary)
                }
            }
            composable(Screen.Create.route) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Gemini Nano Banana 2.1 & Create Studio", color = TextPrimary)
                }
            }
            composable(Screen.Reels.route) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Full Screen Video Reels", color = TextPrimary)
                }
            }
            composable(Screen.Profile.route) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("User Profile & Stats", color = TextPrimary)
                }
            }
            composable(Screen.Chat.route) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Firebase Real-time Chat", color = TextPrimary)
                }
            }
            composable(Screen.Notifications.route) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Activity & Notifications", color = TextPrimary)
                }
            }
            composable(Screen.Settings.route) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Settings & Firebase Hub", color = TextPrimary)
                }
            }
        }
    }
}
