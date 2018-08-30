<?php

// 'At-Will Groups' source code
// (c) 2018 Ellie Hawk "@squeevee"

use Squeevee\AtWillGroups\Listener;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listener\AddAtWillGroupsApi::class);
    $events->subscribe(Listener\AddClientAssets::class);
    $events->subscribe(Listener\AddPermission::class);
};
